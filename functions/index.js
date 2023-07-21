import express from 'express'
import cors from 'cors'
import { onRequest } from 'firebase-functions/v2/https'
import { signup, login, getProfile } from './src/users.js'

const app = express()
app.use(cors()) // allows access from other domains
app.use(express.json()) // patch and post in json

// routes:
app.post("/signup", signup) // POST /users
app.post("/login", login) // GET /users?email=blah@plop.com&password=secretStuff

// protected: (authenticated users only)
app.get("/profile", getProfile)
// app.patch("/profile")

export const api = onRequest(app) // send all https requests to express
