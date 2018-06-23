"use strict";
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { productRouter } from '../src/api/routes/products';
import { orerRouter } from '../src/api/routes/orders';
import { userRouter } from '../src/api/routes/users';
import dotenv = require('dotenv');
import { OK, NOT_FOUND, BAD_REQUEST } from 'http-status-codes';
dotenv.config();

class App {
    public app: express.Application;
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    public config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        this.app.use((req,res,next) => {                         //  hendling CORS error's
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(OK).json({});
    }
        next();
    });
        
        // this.ErrorHandler();
         
    }
    // private ErrorHandler() {
    //     this.app.use((req, res, next) => {
    //         const err: {
    //             status?: number;
    //             message: string;
    //         } = new Error('Not Found');
    //         err.status = NOT_FOUND;
    //         next(err);
    //     });
    //     if (this.app.get('env') === 'development') {
    //         this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    //             res.status(err['status'] || BAD_REQUEST);
    //             res.render('error', {
    //                 message: err.message,
    //                 error: err
    //             });
    //             next();
    //         });
    //     }
    //     this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    //         res.status(err.status || BAD_REQUEST);
    //         res.render('error', {
    //             message: err.message,
    //             error: {}
    //         });
    //     });
    // }

    public routes() {
        let router: express.Router;
        router = express.Router();  
        
        this.app.use('/products', productRouter);
        this.app.use('/orders', orerRouter);
        this.app.use('/users', userRouter);
    }
}

export default new App().app;
