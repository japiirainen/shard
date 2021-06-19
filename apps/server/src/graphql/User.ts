import { TE, pipe } from '@/infrastructure/fpts'
import gql from 'graphql-tag'

import {
   allUsers,
   getPublicProfile,
   getPublicUser,
   NoProfileFound,
   NoUserFound,
} from '@/features/user/service'
import { doTE } from '@/infrastructure/Helpers'
import { MyContext } from './Context'
import { Id } from '@/infrastructure/Id'
import { DbUser, UserWithProfile } from '@/domain/User'
import { Pool } from 'pg'
import { DBError } from '@/infrastructure/Db'

export const userSchema = gql`
   type Query {
      user(id: Int!): User
      users: [User]
      profileUser(id: Int!): ProfileUser
   }

   type User {
      id: Int!
      username: String!
      email: String!
      userType: USER_TYPE!
   }

   type ProfileUser {
      id: Int!
      username: String!
      email: String!
      userType: USER_TYPE!
      profile: Profile!
   }

   type Profile {
      bio: String!
      avatarUrl: String!
   }

   enum USER_TYPE {
      athlete
      coach
   }
`

type UserArgs = { id: Id<DbUser> }
export const userResolvers = {
   Query: {
      user: (_: any, { id }: UserArgs, { pool }: MyContext) =>
         doTE(getPublicUser(id, pool)),
      users: (_: any, __: any, { pool }: MyContext) => doTE(allUsers(pool)),
      profileUser: (_: any, { id }: UserArgs, { pool }: MyContext) =>
         doTE(getUserWithProfile(id, pool)),
   },
}

// --------------------------------------------------------------------------
const getUserWithProfile = (
   id: Id<DbUser>,
   pool: Pool
): TE.TaskEither<DBError | NoUserFound | NoProfileFound, UserWithProfile> =>
   pipe(
      TE.bindTo('user')(getPublicUser(id, pool)),
      TE.bind('profile', () => getPublicProfile(id, pool)),
      TE.map(({ user, profile }) => ({
         id: user.id,
         username: user.username,
         email: user.email,
         userType: user.userType,
         profile: { bio: profile.bio, avatarUrl: profile.avatarUrl },
      }))
   )
