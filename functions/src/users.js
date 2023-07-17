import jwt from 'jsonwebtoken'
import { db } from './dbConnect.js'
import { secret } from '../creds.js'

const coll = db.collection('users')

export async function signup(req, res) {
  const { email, password } = req.body
  // TODO: hash passwords
  await coll.insertOne({ email: email.toLowerCase(), password })
  // Note: not checking if email already exists or doing any validation
  login(req, res)
}

export async function login(req, res) {
  const { email, password } = req.body
  let user = await coll.findOne({ email: email.toLowerCase(), password })
  delete user.password // strip out password
  const token = jwt.sign(user, secret)
  res.send({ user, token })
}

// TODO: getProfile

// TODO: editProfile

