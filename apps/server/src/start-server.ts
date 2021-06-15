import express from 'express'
import pino from 'pino'
import httpPino from 'pino-http'
import dotenv from 'dotenv'
dotenv.config()

import { ApolloServer } from 'apollo-server-express'
import { applyMiddleware } from 'graphql-middleware'
import { PrismaClient } from '@prisma/client'

import { PORT } from './config'
import { schema } from './graphql/schema'

const prisma = new PrismaClient()
const logger = pino({ prettyPrint: true })
const httpLogger = httpPino({ prettyPrint: true })
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
