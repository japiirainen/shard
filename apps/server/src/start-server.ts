import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import { ApolloServer } from 'apollo-server-express'
import { applyMiddleware } from 'graphql-middleware'
import { PrismaClient } from '@prisma/client'

import { PORT } from '@/infrastructure/config'
import { schema } from '@/graphql/schema'
import { logger, httpLogger } from '@/infrastructure/Logger'

const prisma = new PrismaClient()
;(async () => {
   const app = express()
   // ? Middleware
   app.set('trust proxy', 1)
   app.use(httpLogger)

   const server = new ApolloServer({
      schema: applyMiddleware(schema),
      context: ctx => ({ ...ctx, repo: prisma, logger }),
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
   .finally(() => prisma.$disconnect())
