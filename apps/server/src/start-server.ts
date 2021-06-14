import dotenv from 'dotenv'

import { ApolloServer } from 'apollo-server'
import { PrismaClient } from '@prisma/client'

import typeDefs from './graphql/schema'
import resolvers from './graphql/resolvers'

dotenv.config()

const prisma = new PrismaClient()

const server = new ApolloServer({
   typeDefs,
   resolvers,
})

server.listen().then(({ url }) => console.log(`Server listening on: ${url}`))
