import jwt from 'jsonwebtoken'
import { hash } from 'bcrypt'
import { ObjectId } from 'mongodb'
import { db } from './dbConnect.js'
import { secret, salt } from '../creds.js'

const coll = db.collection('users')

export async function signup(req, res) {
  const { email, password } = req.body
  // TODO: hash passwords
  const hashedPassword = await hash(password, salt)
  await coll.insertOne({ email: email.toLowerCase(), password: hashedPassword })
  // Note: not checking if email already exists or doing any validation
  login(req, res)
}

export async function login(req, res) {
  const { email, password } = req.body
  const hashedPassword = await hash(password, salt)
  let user = await coll.findOne({ email: email.toLowerCase(), password: hashedPassword })
  if(!user) {
    res.status(401).send({ message: 'Invalid email or password.' })
    return
  }
  delete user.password // strip out password
  const token = jwt.sign(user, secret) // ENCODE
  res.send({ user, token })
}

export async function getProfile(req, res) {
  const user = await coll.findOne({ _id: new ObjectId(req.decodedToken._id) })
  res.send({ user })
}

export async function updateProfile(req, res) {
  await coll.updateOne(
    { _id: new ObjectId(req.params.uid)}, // object to update
    { $set: req.body }) // new stuff to put in doc
  res.status(202).send({ message: 'User profile updated', success: true })
}
