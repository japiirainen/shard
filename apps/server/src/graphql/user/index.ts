import gql from 'graphql-tag'

import { allUsers } from '@/features/user/service'
import { doTE } from '@/infrastructure/Helpers'
import { MyContext } from '../Context'

export const userSchema = gql`
   type Query {
      user(id: String!): User
      users: [User]
   }

   type User {
      id: String!
      username: String!
      email: String!
      userType: USER_TYPE!
   }

   enum USER_TYPE {
      athlete
      coach
   }
`

export const userResolvers = {
   Query: {
      user: () => ({
         id: '1',
         username: 'foobar',
         email: 'foo@bar.com',
         userType: 'coach',
      }),
      users: (_: any, __: any, ctx: MyContext) => doTE(allUsers(ctx.pool)),
   },
}
