export type USER_TYPE = 'coach' | 'athlete'

export type User = {
   id: number
   username: String
   email: String
   password: String
   user_type: USER_TYPE
   created_at: Date
   updated_at: Date
}

export type Profile = {
   id: number
   profile_owner: number
   bio: String
   avatar_url: String
}

export type PublicUser = {
   id: number
   username: String
   email: String
   userType: USER_TYPE
}

export type PublicProfile = {
   bio: String
   avatarUrl: String
}

export type UserWithProfile = PublicUser & { profile: PublicProfile }

export const toPublicProfile = (profile: Profile): PublicProfile => ({
   bio: profile.bio,
   avatarUrl: profile.avatar_url,
})

export const toPublicUser = (user: User): PublicUser => ({
   id: user.id,
   username: user.username,
   email: user.email,
   userType: user.user_type,
})
