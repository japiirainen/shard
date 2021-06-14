import dotenv from 'dotenv'

import { ApolloServer } from 'apollo-server'
import { PrismaClient } from '@prisma/client'

import typeDefs from './graphql/schema'
import resolvers from './graphql/resolvers'
import { HOST, PORT } from './config'

dotenv.config()

const prisma = new PrismaClient()

const server = new ApolloServer({
   typeDefs,
   resolvers,
})

console.log(HOST)
console.log(PORT)

server
   .listen({ port: PORT, host: HOST })
   .then(({ url }) => console.log(`Server listening on: ${url}`))
