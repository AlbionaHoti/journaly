import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  CommentFragmentFragment as CommentType,
} from '../../generated/graphql'
import Button, { ButtonSize, ButtonVariant } from '../../elements/Button'
import BlankAvatarIcon from '../Icons/BlankAvatarIcon'
import theme from '../../theme'
import EditIcon from '../Icons/EditIcon'
import DeleteIcon from '../Icons/DeleteIcon'
import { formatDateRelativeToNow } from '../../utils'

type CommentProps = {
  comment: CommentType
  canEdit: boolean
  onUpdateComment: any
}

const Comment: React.FC<CommentProps> = ({ comment, canEdit, onUpdateComment }) => {
  const editTextarea = useRef<HTMLInputElement>(null)
  const [isEditMode, setIsEditMode] = React.useState<boolean>(false)
  const [updatingCommentBody, setUpdatingCommentBody] = useState<string>(comment.body)

  useEffect(() => {
    const el = editTextarea.current
    console.log('1', el)
    if (el) {
      console.log('2', el)
      el.focus()
      el.setSelectionRange(el.value.length, el.value.length)
    }
  }, [editTextarea.current])

  const [updateComment, { loading }] = useUpdateCommentMutation({
    onCompleted: () => {
      onUpdateComment()
      setUpdatingCommentBody('')
    },
  })

  const updateExistingComment = () => {
    updateComment({
      variables: {
        commentId: comment.id,
        body: updatingCommentBody,
      },
    })
    setIsEditMode(false)
  }

  const [deleteComment] = useDeleteCommentMutation({
    onCompleted: () => {
      // just refetches the post as in updateComment
      onUpdateComment()
    },
  })

  const deleteExistingComment = () => {
    deleteComment({
      variables: {
        commentId: comment.id,
      },
    })
  }

  return (
    <div className="comment">
      <div className="author-body-container">
        <div className="author-block">
          <Link href={`/dashboard/profile/${comment.author.id}`}>
            <a className="author-info">
              {comment.author.profileImage ? (
                <img className="profile-image" src={comment.author.profileImage} alt="" />
              ) : (
                <BlankAvatarIcon size={20} />
              )}
            </a>
          </Link>
          <div className="identifier-date-block">
            <span className="author-identifier">
              {comment.author.name
                ? `${comment.author.name} (@${comment.author.handle})`
                : `@${comment.author.handle}`}
            </span>
            <span className="comment-date">{formatDateRelativeToNow(comment.createdAt)} ago</span>
          </div>
        </div>
        <div className="body-block">
          {isEditMode ? (
            <textarea
              ref={editTextarea}
              value={updatingCommentBody}
              onChange={(e) => setUpdatingCommentBody(e.target.value)}
            />
          ) : (
            <p>{comment.body}</p>
          )}
        </div>
      </div>
      {canEdit && !isEditMode && (
        <div className="edit-block">
          <span
            className="edit-btn"
            onClick={() => {
              setIsEditMode(true)
            }}
          >
            <EditIcon size={24} />
          </span>
          <span className="delete-btn" onClick={deleteExistingComment}>
            <DeleteIcon size={24} />
          </span>
        </div>
      )}
      {canEdit && isEditMode && (
        <>
          <Button
            size={ButtonSize.Small}
            onClick={updateExistingComment}
            loading={loading}
            variant={ButtonVariant.PrimaryDark}
            style={{
              marginRight: '5px',
            }}
          >
            Save
          </Button>
          <Button
            size={ButtonSize.Small}
            onClick={() => {
              setUpdatingCommentBody(comment.body)
              setIsEditMode(false)
            }}
            disabled={loading}
            variant={ButtonVariant.Secondary}
          >
            Cancel
          </Button>
        </>
      )}
      <style jsx>{`
        .comment {
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
        }

        .author-body-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
        }
        .author-block {
          display: flex;
          align-items: center;
          font-weight: bold;
          font-size: 0.75em;
        }

        .author-block span {
          margin-left: 5px;
        }

        .author-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .profile-image {
          border-radius: 50%;
          width: 30px;
          height: 30px;
          object-fit: cover;
        }

        .author-block :global(svg) {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: ${theme.colors.blueLight};
        }

        .identifier-date-block {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .comment-date {
          font-weight: 400;
          color: ${theme.colors.gray600};
        }

        .body-block {
          margin: 5px 10px 10px 0;
          text-align: left;
        }

        .body-block :global(p) {
          word-wrap: break-word;
        }

        .edit-block {
          display: flex;
          margin-left: 10px;
        }

        .edit-block span {
          margin-right: 5px;
          display: flex;
          align-items: center;
        }

        .edit-btn :global(svg:hover) {
          cursor: pointer;
          fill: ${theme.colors.blueLight};
        }
        .delete-btn :global(svg:hover) {
          cursor: pointer;
          fill: ${theme.colors.red};
        }

        textarea {
          flex: 1;
          width: 100%;
          outline: none;
          padding: 5px;
          margin-right: 10px;
          background-color: transparent;
          resize: vertical;
          border: 1px solid ${theme.colors.gray400};
          border-radius: 5px;
        }
      `}</style>
    </div>
  )
}

export default Comment
