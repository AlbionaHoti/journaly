import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { withApollo } from '../../../lib/apollo'
import Post from '../../../components/Dashboard/Post'
import LoadingWrapper from '../../../components/LoadingWrapper'
import DashboardLayout from '../../../components/Layouts/DashboardLayout'
import { useCurrentUserQuery, usePostByIdQuery } from '../../../generated/graphql'
import PostAuthorCard from '../../../components/Dashboard/Post/PostAuthorCard'
import PostComments from '../../../components/Dashboard/Post/PostComments'

const PostPage: NextPage = () => {
  const idStr = useRouter().query.id as string
  const id = parseInt(idStr, 10)
  const { refetch, loading: postLoading, error: postError, data: postData } = usePostByIdQuery({
    variables: { id },
  })
  const { loading: userLoading, error: userError, data: userData } = useCurrentUserQuery()

  return (
    <LoadingWrapper loading={postLoading || userLoading} error={postError || userError}>
      <DashboardLayout>
        <div className="post-page-wrapper">
          <Post post={postData?.postById} currentUser={userData?.currentUser} refetch={refetch} />
          <div className="post-lower-section">
            <PostComments />
            <PostAuthorCard author={postData?.postById?.author} />
          </div>
          <style jsx>{`
            .post-lower-section {
              display: flex;
              justify-content: space-between;
            }
          `}</style>
        </div>
      </DashboardLayout>
    </LoadingWrapper>
  )
}

PostPage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'post'],
})

export default withApollo(PostPage)
