import { Id } from '@/infrastructure/Id'
export type USER_TYPE = 'coach' | 'athlete'

export type DbUser = {
   id: Id<DbUser>
   username: String
   email: String
   password: String
   user_type: USER_TYPE
   created_at: Date
   updated_at: Date
}

export type DbProfile = {
   id: Id<DbProfile>
   profile_owner: number
   bio: String
   avatar_url: String
}

export type PublicUser = {
   id: Id<PublicUser>
   username: String
   email: String
   userType: USER_TYPE
}

export type PublicProfile = {
   bio: String
   avatarUrl: String
}

export type UserWithProfile = PublicUser & { profile: PublicProfile }

export const toPublicProfile = (profile: DbProfile): PublicProfile => ({
   bio: profile.bio,
   avatarUrl: profile.avatar_url,
})

export const toPublicUser = (user: DbUser): PublicUser => ({
   id: user.id,
   username: user.username,
   email: user.email,
   userType: user.user_type,
})
