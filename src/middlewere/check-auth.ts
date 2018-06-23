import { verify, JsonWebTokenError, NotBeforeError, TokenExpiredError }  from 'jsonwebtoken';
import {  Response, NextFunction } from 'express';
import { Request } from 'express';
import { UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes';

export interface Idecoded {
    id?: string; 
}
export interface newReq extends Request {
    userId: string
}

export function verifyToken( req: newReq, res: Response, next: NextFunction ) {
    const token:any = req.headers['x-access-token'];
    if (!token) {
        return res.status(UNAUTHORIZED).json({
            auth: false,
            message: 'No token provided.'
        });
    }
    verify(token, 'mysupersecret', async ( err: JsonWebTokenError | NotBeforeError | TokenExpiredError, decoded: Idecoded | string ) => { 
        if (err) 
            return res.status(BAD_REQUEST).json({
                auth: false,
                message: 'Failed to authenticate token.'
            });
         if(typeof decoded === 'object' && !!decoded.id) req.userId = decoded.id;
        next();
    });
}

















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

