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
const jsonwebtoken_1 = require("jsonwebtoken");
const http_status_codes_1 = require("http-status-codes");
function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(http_status_codes_1.UNAUTHORIZED).json({
            auth: false,
            message: 'No token provided.'
        });
    }
    jsonwebtoken_1.verify(token, 'mysupersecret', (err, decoded) => __awaiter(this, void 0, void 0, function* () {
        if (err)
            return res.status(http_status_codes_1.BAD_REQUEST).json({
                auth: false,
                message: 'Failed to authenticate token.'
            });
        if (typeof decoded === 'object' && !!decoded.id)
            req.userId = decoded.id;
        next();
    }));
}
exports.verifyToken = verifyToken;
// import { verify, JsonWebTokenError, NotBeforeError, TokenExpiredError }  from 'jsonwebtoken';
// import {  Response, NextFunction } from 'express';
// import { UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes';
// import { newReq } from '../newReq';
// export interface Idecoded {
//     id?: string; 
// }
// export function verifyToken( req: newReq, res: Response, next: NextFunction ) {
//     const token:any = req.headers['x-access-token'];
//     if (!token) {
//         return res.status(UNAUTHORIZED).json({
//             auth: false,
//             message: 'No token provided.'
//         });
//     }
//     verify(token, 'mysupersecret', async ( err: JsonWebTokenError | NotBeforeError | TokenExpiredError, decoded: Idecoded | string ) => { 
//         if (err) 
//             return res.status(BAD_REQUEST).json({
//                 auth: false,
//                 message: 'Failed to authenticate token.'
//             });
//          if(typeof decoded === 'object' && !!decoded.id) req.userId = decoded.id;
//         next();
//     });
// }
//# sourceMappingURL=check-auth.js.map