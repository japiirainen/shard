import dotenv from 'dotenv'
dotenv.config()
const { HOST, PORT, DATABASE_URL } = process.env

export { HOST, PORT, DATABASE_URL }
