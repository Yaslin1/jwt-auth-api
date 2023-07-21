import express from 'express'
import cors from 'cors'
import { onRequest } from 'firebase-functions/v2/https'
import { validToken, matchingUser } from './src/middleware.js'
import { signup, login, getProfile, updateProfile } from './src/users.js'

const app = express()
app.use(cors()) // allows access from other domains
app.use(express.json()) // patch and post in json

// routes:
app.post("/signup", signup)
app.post("/login", login)

// protected: (authenticated users only)
app.get("/profile", validToken, getProfile)
app.patch("/profile", validToken, matchingUser, updateProfile)
// app.get("/secretStuff", validToken, getSecretsStuff)

export const api = onRequest(app) // send all https requests to express
