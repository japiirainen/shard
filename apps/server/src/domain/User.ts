export type USER_TYPE = 'coach' | 'athlete'

export type User = {
   id: String
   username: String
   email: String
   password: String
   userType: USER_TYPE
   createdAt: Date
   updatedAt: Date
}

export type PublicUser = Pick<User, 'id' | 'username' | 'email' | 'userType'>

export const toPublicUser = (user: User): PublicUser => ({
   id: user.id,
   username: user.username,
   email: user.email,
   userType: user.userType,
})
