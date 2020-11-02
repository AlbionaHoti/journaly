import React from 'react'

import { PostStatus, TopicFragmentFragment as TopicType, LanguageFragmentFragment as LanguageType } from '../../generated/graphql'
import { useTranslation } from '../../config/i18n'
import { formatLongDate } from '../../utils'

import theme from '../../theme'

type PostHeaderProps = {
  postTitle: string
  postStatus: PostStatus
  publishDate: string
  authorName: string
  postImage: string
  topics?: TopicType[]
  language?: LanguageType
  children?: React.ReactNode
}

const PostHeader: React.FC<PostHeaderProps> = ({
  children,
  postTitle,
  postStatus,
  authorName,
  publishDate,
  postImage,
  topics,
  language,
}) => {
  const { t } = useTranslation('post')
  return (
    <div className="post-header">
      <img src={postImage} alt={postTitle} />
      <div className="post-header-info" dir="auto">
        <div className="top-badges">
          { language && <div className="language badge">{language.name}</div> }
          {postStatus === 'DRAFT' && <div className="draft badge">{t('draft')}</div>}
        </div>

        <div className="title-and-info">
          <h1>{postTitle}</h1>
          <p> &mdash; </p>
          <p>
            {t('postBy')} <em>{authorName}</em>
          </p>
          <p>{formatLongDate(publishDate)}</p>
        </div>

        <div className="topics-container">
          {(topics || []).map(({ id, name }) => (
            <div className="topic-badge" key={id}>{name}</div>
          ))}
        </div>
      </div>
      {children}
      <style jsx>{`
        .post-header {
          position: relative;
          grid-column: 1 / -1;
          text-align: center;
          color: white;
          margin-bottom: 40px;
        }

        .badge {
          position: absolute;

          line-height: 1;
          padding: 2px 5px;
          color: white;

          text-transform: uppercase;
          border: 2px solid white;
          border-radius: 4px;
          font-weight: bold;
          font-size: 12px;
        }

        .draft {
          top: 10px;
          right: 10px;
        }

        .language {
          top: 10px;
          left: 10px;
        }

        .top-badges {
          display: block;
          height: 40px;
        }

        .topics-container {
          display: flex;
          width: 100%;
          justify-content: center;
          flex-wrap: wrap;
          padding: 10px;
        }

        .topic-badge {
          line-height: 1;
          padding: 2px 5px;
          margin-right: 5px;
          color: white;

          text-transform: uppercase;
          border: 2px solid white;
          border-radius: 4px;
          font-weight: bold;
          font-size: 12px;
          margin-bottom: 5px;
        }

        img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          filter: brightness(0.3);
        }

        .post-header-info {
          position: relative;
          min-height: 310px;
          display: flex;
          flex-direction: column
        }

        .title-and-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin: 0 10%;
          flex: 1;
        }

        h1 {
          font-size: 40px;
          line-height: 1.2;
          text-align: center;
          color: white;
          margin: 0;
        }

        p {
          font-size: 14px;
        }

        @media (min-width: ${theme.breakpoints.MD}) {
          h1 {
            font-size: 50px;
          }
          p {
            font-size: 16px;
          }
        }

        @media (min-width: ${theme.breakpoints.LG}) {
          h1 {
            font-size: 64px;
          }
        }
      `}</style>
    </div>
  )
}

export default PostHeader
