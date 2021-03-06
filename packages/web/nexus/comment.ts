import {
  intArg,
  stringArg,
  objectType,
  extendType,
} from '@nexus/schema'

import { NotificationType } from '@journaly/j-db-client'

import {
  hasAuthorPermissions,
  createNotification,
} from './utils'
import { NotFoundError } from './errors'

const Thread = objectType({
  name: 'Thread',
  definition(t) {
    t.model.id()
    t.model.archived()
    t.model.startIndex()
    t.model.endIndex()
    t.model.highlightedContent()
    t.model.comments({
      pagination: false,
      ordering: {
        createdAt: true,
      },
    })
  },
})

const Comment = objectType({
  name: 'Comment',
  definition(t) {
    t.model.id()
    t.model.author()
    t.model.body()
    t.model.createdAt()
    t.model.thanks({ pagination: false })
  },
})

const PostComment = objectType({
  name: 'PostComment',
  definition(t) {
    t.model.id()
    t.model.author()
    t.model.body()
    t.model.createdAt()
  },
})

const PostMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createThread', {
      type: 'Thread',
      args: {
        postId: intArg({ required: true }),
        startIndex: intArg({ required: true }),
        endIndex: intArg({ required: true }),
        highlightedContent: stringArg({ required: true }),
      },
      resolve: async (_parent, args, ctx) => {
        const { userId } = ctx.request

        if (!userId) {
          throw new Error('You must be logged in to create threads.')
        }

        const { postId, startIndex, endIndex, highlightedContent } = args
        const post = await ctx.db.post.findUnique({ where: { id: postId } })

        if (!post) {
          throw new Error(`Unable to find post with id ${postId}`)
        }

        const thread = await ctx.db.thread.create({
          data: {
            startIndex,
            endIndex,
            highlightedContent,
            post: { connect: { id: postId } },
          },
        })

        // Subscribe the post author to every thread made on their posts
        const subData = {
          user: { connect: { id: post.authorId } },
          thread: { connect: { id: thread.id } },
        }
        await ctx.db.threadSubscription.upsert({
          create: subData,
          update: subData,
          where: {
            userId_threadId: {
              userId: post.authorId,
              threadId: thread.id,
            },
          },
        })

        return thread
      },
    })

    t.field('deleteThread', {
      type: 'Thread',
      args: {
        threadId: intArg({ required: true }),
      },
      resolve: async (_parent, args, ctx) => {
        const thread = await ctx.db.thread.findUnique({
          where: {
            id: args.threadId,
          },
          include: {
            comments: true,
          },
        })

        if (!thread) throw new Error('Thread not found.')

        if (thread.comments.length !== 0) {
          throw new Error('Cannot delete a thread containing comments.')
        }

        await ctx.db.threadSubscription.deleteMany({
          where: {
            threadId: thread.id,
          },
        })
        return ctx.db.thread.delete({
          where: {
            id: args.threadId,
          },
        })
      },
    })

    t.field('createComment', {
      type: 'Comment',
      args: {
        threadId: intArg({ required: true }),
        body: stringArg({ required: true }),
      },
      resolve: async (_parent, args, ctx) => {
        const { userId } = ctx.request
        if (!userId) {
          throw new Error('You must be logged in to post comments.')
        }

        const thread = await ctx.db.thread.findUnique({
          where: { id: args.threadId },
          include: {
            subscriptions: {
              include: {
                user: true,
              },
            },
            post: {
              include: {
                author: true,
              },
            },
          },
        })
        if (!thread) {
          throw new NotFoundError('thread')
        }

        const comment = await ctx.db.comment.create({
          data: {
            body: args.body,
            author: {
              connect: { id: userId },
            },
            thread: {
              connect: { id: thread.id },
            },
          },
          include: {
            author: true,
          },
        })

        const subData = {
          user: { connect: { id: userId } },
          thread: { connect: { id: thread.id } },
        }
        await ctx.db.threadSubscription.upsert({
          create: subData,
          update: subData,
          where: {
            userId_threadId: {
              threadId: thread.id,
              userId,
            },
          },
        })

        const promises: Promise<any>[] = []
        thread.subscriptions.forEach(({ user }) => {
          if (user.id === userId) {
            // This is the user creating the comment, do not notify them.
            return
          }

          promises.push(createNotification(
            ctx.db,
            user,
            {
              type: NotificationType.THREAD_COMMENT,
              comment
            }
          ))
        })

        await Promise.all(promises)

        return comment
      },
    })

    t.field('updateComment', {
      type: 'Comment',
      args: {
        commentId: intArg({ required: true }),
        body: stringArg({ required: true }),
      },
      resolve: async (_parent, args, ctx) => {
        const { userId } = ctx.request
        if (!userId) throw new Error('You must be logged in to do that.')

        const [currentUser, originalComment] = await Promise.all([
          ctx.db.user.findUnique({
            where: {
              id: userId,
            },
          }),
          ctx.db.comment.findUnique({
            where: {
              id: args.commentId,
            },
          }),
        ])

        if (!currentUser) throw new Error('User not found.')
        if (!originalComment) throw new Error('Comment not found.')

        hasAuthorPermissions(originalComment, currentUser)

        const comment = await ctx.db.comment.update({
          data: {
            body: args.body,
          },
          where: {
            id: args.commentId,
          },
        })

        return comment
      },
    })
    t.field('deleteComment', {
      type: 'Comment',
      args: {
        commentId: intArg({ required: true }),
      },
      resolve: async (_parent, args, ctx) => {
        const { userId } = ctx.request
        if (!userId) throw new Error('You must be logged in to do that.')

        const currentUser = await ctx.db.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!currentUser) throw new Error('User not found.')

        const originalComment = await ctx.db.comment.findUnique({
          where: {
            id: args.commentId,
          },
        })

        if (!originalComment) throw new Error('Comment not found.')

        hasAuthorPermissions(originalComment, currentUser)

        const comment = await ctx.db.comment.delete({
          where: {
            id: args.commentId,
          },
        })

        return comment
      },
    })

    t.field('createPostComment', {
      type: 'PostComment',
      args: {
        postId: intArg({ required: true }),
        body: stringArg({ required: true }),
      },
      resolve: async (_parent, args, ctx) => {
        const { userId } = ctx.request
        if (!userId) {
          throw new Error('You must be logged in to post comments.')
        }

        const post = await ctx.db.post.findUnique({
          where: {
            id: args.postId,
          },
          include: {
            author: true,
            postCommentSubscriptions: {
              include: {
                user: true,
              },
            },
          },
        })

        if (!post) {
          throw new NotFoundError('post')
        }

        const postComment = await ctx.db.postComment.create({
          data: {
            body: args.body,
            author: {
              connect: { id: userId },
            },
            post: {
              connect: { id: post.id },
            },
          },
          include: {
            author: true,
          },
        })

        const subData = {
          user: { connect: { id: userId } },
          post: { connect: { id: post.id } },
        }

        await ctx.db.postCommentSubscription.upsert({
          create: subData,
          update: subData,
          where: {
            userId_postId: {
              userId,
              postId: post.id,
            }
          }
        })

        const promises: Promise<any>[] = []
        post.postCommentSubscriptions.forEach(({ user }) => {
          if (user.id === userId) {
            // This is the user creating the comment, do not notify them.
            return
          }

          promises.push(createNotification(
            ctx.db,
            user,
            {
              type: NotificationType.POST_COMMENT,
              postComment
            }
          ))
        })

        await Promise.all(promises)

        // TODO: Set up logging and check for successful `mailResponse`
        return postComment
      },
    })

    t.field('updatePostComment', {
      type: 'PostComment',
      args: {
        postCommentId: intArg({ required: true }),
        body: stringArg({ required: true }),
      },
      resolve: async (_parent, args, ctx) => {
        const { userId } = ctx.request
        if (!userId) throw new Error('You must be logged in to do that.')

        const [currentUser, originalPostComment] = await Promise.all([
          ctx.db.user.findUnique({
            where: {
              id: userId,
            },
          }),
          ctx.db.postComment.findUnique({
            where: {
              id: args.postCommentId,
            },
          }),
        ])

        if (!currentUser) throw new Error('User not found.')
        if (!originalPostComment) throw new Error('Comment not found.')

        hasAuthorPermissions(originalPostComment, currentUser)

        const postComment = await ctx.db.postComment.update({
          data: {
            body: args.body,
          },
          where: {
            id: args.postCommentId,
          },
        })

        return postComment
      },
    })
    t.field('deletePostComment', {
      type: 'PostComment',
      args: {
        postCommentId: intArg({ required: true }),
      },
      resolve: async (_parent, args, ctx) => {
        const { userId } = ctx.request
        if (!userId) throw new Error('You must be logged in to do that.')

        const currentUser = await ctx.db.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!currentUser) throw new Error('User not found.')

        const originalPostComment = await ctx.db.postComment.findUnique({
          where: {
            id: args.postCommentId,
          },
        })

        if (!originalPostComment) throw new Error('Comment not found.')

        hasAuthorPermissions(originalPostComment, currentUser)

        const postComment = await ctx.db.postComment.delete({
          where: {
            id: args.postCommentId,
          },
        })

        return postComment
      },
    })
  },
})

export default [
  Thread,
  Comment,
  PostComment,
  PostMutations,
]
