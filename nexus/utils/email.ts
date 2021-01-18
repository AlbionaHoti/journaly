import * as AWS from 'aws-sdk'
import { User, BadgeType } from '@journaly/j-db-client'
import { makeEmail } from '@/lib/mail'

AWS.config.credentials = new AWS.Credentials(
  process.env.JAWS_ACCESS_KEY_ID!,
  process.env.JAWS_SECRET_ACCESS_KEY!,
)
const sqs = new AWS.SQS({ region: 'us-east-2' })

type sendPasswordResetTokenEmailArgs = {
  user: User
  resetToken: string
}

type sendNewBadgeEmailArgs = {
  badgeType: BadgeType
  user: User
}

type EmailParams = {
  from: string
  to: string
  subject: string
  html: string
}

type SqsParams = {
  MessageBody: string
  QueueUrl: string
}

export const sendJmail = (emailParams: EmailParams) => {
  if (!process.env.JMAIL_QUEUE_URL) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'NODE_ENV is prod, but no JMAIL_QUEUE_URL is specified. Something is probably very wrong.',
      )
    }

    // We don't have a jmail queue url, so let's just spit this out to the
    // console for debugging
    console.info(
      'Would have sent the follwing email data to the jmail queue if I had a JMAIL_QUEUE_URL:',
    )
    console.info(emailParams)
    return new Promise((res) => res())
  }

  const params: SqsParams = {
    MessageBody: JSON.stringify(emailParams),
    QueueUrl: process.env.JMAIL_QUEUE_URL!,
  }

  return new Promise((res, rej) => {
    sqs.sendMessage(params, function (err, data) {
      if (err) {
        rej(err)
      } else {
        res(data)
      }
    })
  })
}

export const sendPasswordResetTokenEmail = ({
  user,
  resetToken,
}: sendPasswordResetTokenEmailArgs) => {
  return sendJmail({
    from: 'robin@journaly.com',
    to: user.email,
    subject: 'Your Password Reset Link',
    html: makeEmail(`
      <p>I heard you were having some trouble logging in.</>
      <p>Click <a href="https://${process.env.SITE_DOMAIN}/dashboard/reset-password?resetToken=${resetToken}">here</a> to reset your password!</p>
      <p>Please note that the link will expire in 1 hour.</p>
      <p>Warmly,</p>
    `),
  })
}

const assertUnreachable = (x: never): never => {
  throw new Error(`Didn't expect to get here ${x}`)
}

const getBadgeName = (badgeType: BadgeType): string => {
  switch (badgeType) {
    case BadgeType.ALPHA_USER:
      return 'Alpha User'
    case BadgeType.BETA_USER:
      return 'Beta User'
    case BadgeType.TEN_POSTS:
      return '10 Posts'
    case BadgeType.ONEHUNDRED_POSTS:
      return '100 Posts'
    case BadgeType.CODE_CONTRIBUTOR:
      return 'Code Contributor'
  }

  return assertUnreachable(badgeType)
}

export const sendNewBadgeEmail = ({ user, badgeType }: sendNewBadgeEmailArgs) => {
  return sendJmail({
    from: 'robin@journaly.com',
    to: user.email,
    subject: 'You earned a new badge!',
    html: makeEmail(`
      <p>Congratulations! You just earned the "${getBadgeName(badgeType)}" badge on Journaly.</p>
      <p>This badge will now be displayed on your <a href="https://${
        process.env.SITE_DOMAIN
      }/dashboard/profile/${user.id}">profile page</a>.</p>
    `),
  })
}
