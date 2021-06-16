import gql from 'graphql-tag'

import { allUsers, getPublicUser } from '@/features/user/service'
import { doTE } from '@/infrastructure/Helpers'
import { MyContext } from '../Context'
import { Id } from '@/infrastructure/Id'
import { User } from '@/domain/User'
import { findUserById } from '@/features/user/repo'

export const userSchema = gql`
   type Query {
      user(id: Int!): User
      users: [User]
   }

   type User {
      id: Int!
      username: String!
      email: String!
      userType: USER_TYPE!
   }

   enum USER_TYPE {
      athlete
      coach
   }
`

type UserArgs = { id: Id<User> }
export const userResolvers = {
   Query: {
      user: (_: any, { id }: UserArgs, { pool }: MyContext) =>
         doTE(getPublicUser(id, pool)),

      users: (_: any, __: any, { pool }: MyContext) => doTE(allUsers(pool)),
   },
}
