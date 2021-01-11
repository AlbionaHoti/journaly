import {
  ValidatedNotification,
  DataForUpdateEmail,
  mapCat,
} from '../utils'

const divider = `
  <hr style="
    width: 25%;
    margin: 35px auto;
    border: 1px solid #313131;
  "/>
`

const formatNotificationBlock = (note: ValidatedNotification): string => {
  switch (note.type) {
    case ('POST_COMMENT'): {
      return `
        <div>
          <h3>
            New post comment on post:
            <a
              href="https://${process.env.SITE_DOMAIN || 'journaly.com'}/post/${note.post.id}"
              style="
                color: #4391C9;
                text-decoration: none;
                font-size: 16px;
            ">
              ${note.post.title}
            </a>
          </h3>
          <p style="font-size: 16px;"><span style="font-weight: 600;">Comment:</span> ${note.postComment.body}</p>
        </div>
      `
    }
    case ('THREAD_COMMENT'): {
      return `
        <div>
          <h3>
            New feedback comment on post:
            <a
              href="https://${process.env.SITE_DOMAIN || 'journaly.com'}/post/${note.post.id}"
              style="
                color: #4391C9;
                text-decoration: none;
                font-size: 16px;
            ">
                ${note.post.title}
            </a>
          </h3>
          <p style="font-size: 16px;"><span style="font-weight: 600;">In response to:</span> <span style="background: #4391C940; padding: 0 5px;">${note.thread.highlightedContent}</span></p>
          <p style="font-size: 16px;"><span style="font-weight: 600;">Comment:</span> ${note.comment.body}</p>
        </div>
      `
    }
  }
}

const updateEmail = (data: DataForUpdateEmail) => {
  return `
    <div style="
      padding: 40px 20px;
      font-family: 'Courier New', Courier, monospace;
      line-height: 1.2;
      background: #ebeae7;
      margin-top: 0px;
    ">
      <div style="
        border-top: 10px solid #313131;
        width: 80%;
        background: white;
        padding: 30px 20px;
        text-align: center;
        margin: 0 auto 25px;
      ">
        <img
          src="https://journaly-email-assets.s3.us-east-2.amazonaws.com/j-logo-100.png"
          style="width: 75px;"
        >
        <h1 style="
          margin-top: 25px;
          margin-bottom: 25px;
          font-size: 24px;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
          font-weight: 400;
        ">Howdy, Journaler!</h1>
        <p style="font-size: 14px; text-align: left;">
          There's been some new activity on Journaly that we thought you'd like to know about. Here's a summary!
        </p>
      </div>

      
      ${ (data.own.length && `
        <div style="
          padding: 5px 20px;
          font-family: 'Courier New', Courier, monospace;
          line-height: 1.2;
          font-size: 14px;
          margin: 0 auto 25px;
          width: 80%;
          background: white;
        ">
          <h2 style="
            text-transform: uppercase;
            text-align: center;
            font-size: 20px;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            font-weight: 400;
          ">Your posts:</h2>
          ${mapCat(data.own, formatNotificationBlock, divider)}
        </div>
      `) || '' }

      ${ (data.other.length && `
        <div style="
          padding: 5px 20px;
          font-family: 'Courier New', Courier, monospace;
          line-height: 1.2;
          font-size: 14px;
          margin: 0 auto 25px;
          width: 80%;
          background: white;
        ">
          <h2 style="
            text-transform: uppercase;
            text-align: center;
            font-size: 20px;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            font-weight: 400;
          ">Posts you've participated in:</h2>
          ${mapCat(data.other, formatNotificationBlock, divider)}
        </div>
      `) || '' }

      <div style="
        background: white;
        width: 80%;
        padding: 5px 20px;
        margin: 0 auto 25px;
      ">
        <p style="font-size: 14px;">Keep up all the great work and thank you for contributing to the community!</p>
        <p style="font-size: 14px; font-weight: 600;">Robin @ Journaly</p>
      </div>
      <div style="
        padding: 40px 20px;
        margin: 0 auto 25px;
        background-color: #313131;
        width: 80%;
        text-align: center; 
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-weight: 400;
        font-size: 10px;
      ">
        <p style="
          text-transform: uppercase;
          color: white;
        ">
          Sent with ❤️ from the <a href="https://www.journaly.com" style="color: #4391C9; text-decoration: none;">journaly</a> team
        </p>
      </div>
    </div>
  `
}

export default updateEmail
