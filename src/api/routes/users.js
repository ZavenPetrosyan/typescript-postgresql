"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv");
    dotenv.config();
}
const express_1 = require("express");
const bcrypt = require("bcrypt");
const db_1 = require("../../config/database/db");
const jwt = require("jsonwebtoken");
const http_status_codes_1 = require("http-status-codes");
class UserRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.db('users')
                .select()
                .where({ email: req.body.email })
                .then((user) => __awaiter(this, void 0, void 0, function* () {
                if (user.length >= 1) {
                    res.status(http_status_codes_1.CONFLICT).json({
                        message: 'Mail exists '
                    });
                }
                else {
                    const salt = yield bcrypt.genSaltSync();
                    const hash = yield bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) {
                            res.status(http_status_codes_1.BAD_REQUEST).json({
                                error: err
                            });
                        }
                        else {
                            return db_1.db('users').insert({
                                email: req.body.email,
                                password: hash
                            })
                                .returning('*').then(result => {
                                console.log(result);
                                res.status(http_status_codes_1.CREATED).json({
                                    message: 'User created'
                                });
                            }).catch(err => {
                                console.log(err);
                                res.status(http_status_codes_1.BAD_REQUEST).json({
                                    error: err
                                });
                            });
                        }
                    });
                }
            }));
        });
    }
    signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.db("users").select()
                    .where({ email: req.body.email })
                    .then(user => {
                    if (user.length < 1) {
                        return res.status(http_status_codes_1.UNAUTHORIZED).json({
                            message: 'Auth faild',
                        });
                    }
                    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                        if (err) {
                            return res.status(http_status_codes_1.UNAUTHORIZED).json({
                                message: 'Auth failed'
                            });
                        }
                        if (result) {
                            const token = jwt.sign({ email: user[0].email, userId: user[0].id }, 'mysupersecret', { expiresIn: '1h' });
                            return res.status(http_status_codes_1.OK).json({
                                message: 'Auth successfull',
                                token: token
                            });
                        }
                        res.status(http_status_codes_1.UNAUTHORIZED).json({
                            message: 'Auth faild'
                        });
                    });
                });
            }
            catch (err) {
                console.log(err);
                res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).json({ error: err });
            }
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.db('users').select()
                    .where({ id: req.params.userId })
                    .del()
                    .then(result => {
                    res.status(http_status_codes_1.OK).json({
                        message: 'User deleted'
                    });
                });
            }
            catch (err) {
                console.log(err);
                res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).json({
                    error: err
                });
            }
        });
    }
    init() {
        this.router.post('/register', this.signUp);
        this.router.post('/login', this.signIn);
        this.router.delete('/:userId', this.deleteUser);
    }
}
exports.UserRouter = UserRouter;
const user = new UserRouter();
exports.userRouter = user.router;
//# sourceMappingURL=users.js.map