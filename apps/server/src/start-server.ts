import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import { ApolloServer } from 'apollo-server-express'
import { applyMiddleware } from 'graphql-middleware'

import { PORT } from '@/infrastructure/Config'
import { schema } from '@/graphql/Schema'
import { logger } from '@/infrastructure/Logger'
import { createPgPool } from '@/infrastructure/db'
import { MyContext } from './graphql/Context'
;(async () => {
   const app = express()
   const pool = createPgPool()
   // ? Middleware
   app.set('trust proxy', 1)

   const server = new ApolloServer({
      schema: applyMiddleware(schema),
      context: (ctx): MyContext => ({ ...ctx, pool, logger }),
      introspection: true,
      playground: true,
      logger,
   })

   server.applyMiddleware({
      app,
      cors: false,
   })

   return [app, server] as const
})()
   .then(([app, server]) =>
      app.listen(PORT, () =>
         logger.info(`Server running at: http://localhost:${PORT}${server.graphqlPath}`)
      )
   )
   .catch(logger.error)
