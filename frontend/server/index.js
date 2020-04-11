const express = require('express')
const next = require('next')
const nextI18NextMiddleware = require('next-i18next/middleware').default
const nextI18next = require('../config/i18n')

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

;(async () => {
  await app.prepare()
  const server = express()

  await nextI18next.initPromise
  server.use(nextI18NextMiddleware(nextI18next))

  server.get('*', (req, res) => handle(req, res))

  server.listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`,
  )
})()
