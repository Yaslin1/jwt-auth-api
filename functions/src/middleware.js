import jwt from "jsonwebtoken"
import { secret } from "../creds.js"

export async function validToken(req,res, next) {
  if(!req,headers || !req.headers.authorization) {
    res.status(401).send({ message:"No authorization token", success: false })
    return
  }
  try {
  const decodedToken = jwt.verify(req.headers.authorization, secret)
  req.decodedToken = decodedToken
  next() //middle ware function that checks to see if we have a token

} catch(err) {
  //if we have an invalid token...
  res.status(401).send({ message: "Invalid Auth Token", success: false })
}
}

export async function matchingUser(req, res, next) {
  if(req.decodedToken._id !== req.params.uid) {
    res.status(401).send({message: "Unauthorized request", success: false})
    return
  }
  next()
}

//JUST AN EXAMPLE:
const adminUsers = [
  "admin1@email.com",
  "admin2@email.com",
  "admin3@email.com",
  "admin4@email.com",
]
export async function isAdmin(req,res,next) {
  if(!req.decodedToken.admin && !adminUsers.includes(req.decodedToken.email)) {
  res.status(401).send({message: "Unauthorized request", success: false})
  return
}
console.log("Admin user:", req.decodedToken.email)
next()
}


// export async function isAdmin(req,res,next) {
//   if(!req.decodedToken.admin && req.decodedToken.email !== "email@email.com") {
//   res.status(401).send({message: "Unauthorized request", success: false})
//   return
// }
// console.log("Admin user:", req.decodedToken.email)
// next()
// }