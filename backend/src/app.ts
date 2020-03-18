import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import { server, schema } from 'nexus-future'
import { request } from 'express'

require('dotenv').config({ path: '../.env ' })

schema.addToContext((request: any) => ({
  request,
  response: request.response,
}))

server.custom(({ express }) => {
  express.use(
    cors({
      origin: process.env.FRONTEND_URL!,
      credentials: true,
    }),
  )

  express.use(cookieParser())
  express.use((request: any, response, next) => {
    const { token } = request.cookies
    request.response = response

    if (token) {
      const { userId } = jwt.verify(token, process.env.APP_SECRET!) as any
      request.userId = userId
    }
    next()
  })
})
