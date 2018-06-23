"use strict";
declare function require(moduleName: string): any;

if (process.env.NODE_ENV !== "production") {
const dotenv: any = require("dotenv");
dotenv.config();
}
import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { db } from '../../config/database/db';
import * as jwt from 'jsonwebtoken';
import { CONFLICT, BAD_REQUEST, CREATED, UNAUTHORIZED, OK, INTERNAL_SERVER_ERROR } from "http-status-codes"


export class UserRouter {
    router: Router;
    constructor() {
        this.router = Router();
        this.init()
    }
public async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
     await db('users')
    .select()
    .where({ email: req.body.email })
    .then(async user => {
        if (user.length >= 1) {
            res.status(CONFLICT).json({
                message: 'Mail exists '
            });
        } else {
        const salt = await bcrypt.genSaltSync();
        const hash = await bcrypt.hash(req.body.password, salt, ( err, hash) => {
            if (err) {
                res.status(BAD_REQUEST).json({
                    error: err
                });
            } else {
            return db('users').insert({
                    email : req.body.email,
                    password : hash
                })
                .returning('*').then(result => {
                    console.log(result);
                    res.status(CREATED).json({
                        message: 'User created'
                    });
                }).catch(err => {
                    console.log(err);
                    res.status(BAD_REQUEST).json({
                        error: err
                        });  
                    });
                }
            });
         }
    })
}
     public async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await db("users").select()
            .where({ email: req.body.email })
            .then(user => {
                if (user.length < 1) {
                    return res.status(UNAUTHORIZED).json({
                        message: 'Auth faild',
                    });
                }  
                bcrypt.compare(req.body.password, user[0].password, (err,result) => {
                    if (err) {
                        return res.status(UNAUTHORIZED).json({
                            message: 'Auth failed'
                        });
                    } 
                    if (result) {
                        const token = jwt.sign({ email: user[0].email, userId: user[0].id},
                            'mysupersecret',
                            { expiresIn: '1h' }
                    );
                        return res.status(OK).json({
                            message: 'Auth successfull',
                            token: token
                        });
                    }
                    res.status(UNAUTHORIZED).json({
                        message: 'Auth faild'
                    });
                });
            })
        } catch(err) {
            console.log(err);
            res.status(INTERNAL_SERVER_ERROR).json({ error: err });
        }
    }

    public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
       try {    
         await db('users').select()
         .where({ id: req.params.userId})
         .del()
         .then( result => {
            res.status(OK).json({
                message: 'User deleted'
            });
         });
       }catch(err) {
            console.log(err);
            res.status(INTERNAL_SERVER_ERROR).json({
                error: err
            });
       }
    }
    init() {
        this.router.post('/register', this.signUp);
        this.router.post('/login', this.signIn);
        this.router.delete('/:userId', this.deleteUser);
    }
}

const user = new UserRouter();
export const userRouter = user.router; 



