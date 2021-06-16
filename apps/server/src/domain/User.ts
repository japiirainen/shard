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

export type PublicUser = {
   id: number
   username: String
   email: String
   userType: USER_TYPE
}

export const toPublicUser = (user: User): PublicUser => ({
   id: user.id,
   username: user.username,
   email: user.email,
   userType: user.user_type,
})
