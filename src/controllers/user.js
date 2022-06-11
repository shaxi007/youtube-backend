import {read, write} from '../utils/model.js'
import { InternalServerError, AuthrizationError } from "../utils/errors.js"
import sha256 from 'sha256'
import jwt from '../utils/jwt.js'
import path from 'path'


const GET = (req, res, next) => {
    try {
        let { userId } = req.params

        if(userId){
            let [ user ] = read('users').filter(user => user.userId == userId)
            delete user.password
            return res.status(200).send(user)
        }

        let users = read('users').filter(user => delete user.password)
        res.status(200).send(users)

    } catch (error) {
        return next( new InternalServerError(500, error.message) )
    }
}

const LOGIN = (req, res, next) => {
    try {

        let {username, password} = req.body
        let users = read('users')

        let user = users.find(user => user.username == username && user.password == sha256(password))

        if(!user){
            return next( new AuthrizationError(401, 'wrong username or password') )
        }

        delete user.password

        res.status(200).json({
            status: 200,
            message: 'success',
            token: jwt.sign({userId: user.userId}),
            data: user  
        })

    } catch (error) {
        return next( new InternalServerError(500, error.message) )
    }
}


const REGISTER = (req, res, next) => {
    try {
        let users = read('users')
        
        req.body.userId = users.length ? users.at(-1).userId + 1 : 1
        req.body.password = sha256(req.body.password)

        let {file} = req.files

        let user = users.find(user => user.username == req.body.username)

        if(user){
            return next( new AuthrizationError(401, 'this username exists') )
        }

        let fileName = Date.now() + file.name.replace(/\s/g, '')
        file.mv(path.join(process.cwd(), 'uploads', fileName))

        req.body.avatar = fileName

        users.push(req.body)
        write('users', users)

        delete req.body.password

        res.status(201).json({
            status: 201,
            message: 'success',
            token: jwt.sign({userId: req.body.userId}),
            data: req.body  
        })
    } catch (error) {
        return next( new InternalServerError(500, error.message) )
    }
}

export default {
    LOGIN, REGISTER,GET
}