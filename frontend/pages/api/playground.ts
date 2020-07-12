let handler

if (process.env.NODE_ENV === 'development') {
  require('nexus').default.reset()
  const app = require('nexus').default
  require('../../nexus/graphql')

  app.assemble()
  handler = app.server.handlers.playground
} else {
  // Disable playground outside of development
  handler = (_: any, res: any) => {
    res.status(403).send('GQL playground is disabled outside of development')
  }
}

export default handler
