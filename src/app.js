"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const products_1 = require("../src/api/routes/products");
const orders_1 = require("../src/api/routes/orders");
const users_1 = require("../src/api/routes/users");
const dotenv = require("dotenv");
const http_status_codes_1 = require("http-status-codes");
dotenv.config();
class App {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
            if (req.method === 'OPTIONS') {
                res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
                return res.status(http_status_codes_1.OK).json({});
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
    routes() {
        let router;
        router = express.Router();
        this.app.use('/products', products_1.productRouter);
        this.app.use('/orders', orders_1.orerRouter);
        this.app.use('/users', users_1.userRouter);
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map