import {
  arg,
  booleanArg,
  objectType,
  extendType
} from '@nexus/schema'


const TopicTranslation = objectType({
  name: 'TopicTranslation',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.uiLanguage()
  },
})

const Topic = objectType({
  name: 'Topic',
  rootTyping: 'prisma.Topic',
  definition(t) {
    t.model.id()
    t.string('name', {
      nullable: true,
      args: {
        uiLanguage: arg({ type: 'UILanguage', required: true }),
      },
      async resolve(parent, args, ctx, _info) {
        const translation = await ctx.db.topicTranslation.findUnique({
          where: {
            uiLanguage_topicId: {
              topicId: parent.id,
              uiLanguage: args.uiLanguage,
            },
          },
        })

        return translation?.name || parent.devName
      },
    })
  },
})

const TopicQueries = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('topics', {
      type: 'Topic',
      args: {
        hasPosts: booleanArg({ required: false }),
      },
      resolve: async (_parent, _args, ctx) => {
        let filter = undefined

        return ctx.db.topic.findMany({
          where: filter,
          orderBy: {
            devName: 'asc',
          },
        })
      },
    })
  },
})

export default [
  TopicTranslation,
  Topic,
  TopicQueries,
]
