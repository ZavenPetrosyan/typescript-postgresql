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
const express_1 = require("express");
const db_1 = require("../../config/database/db");
const http_status_codes_1 = require("http-status-codes");
class OrderRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    getOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.db('orders').select("*")
                    .then(docs => {
                    res.status(http_status_codes_1.OK).json({
                        count: docs.length,
                        orders: docs
                    });
                });
            }
            catch (err) {
                console.log(err);
                res.status(http_status_codes_1.BAD_REQUEST).json({
                    error: err
                });
            }
        });
    }
    createOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = {
                createdAt: new Date(),
                productsid: req.body.productsid,
                quantity: req.body.quantity
            };
            try {
                const newOrder = yield db_1.db("orders")
                    .insert(order, '*')
                    .innerJoin('products', 'order.orderId', 'orders.productsid');
                res.status(http_status_codes_1.OK).json(newOrder);
                // .then(() => {
                //     res.status(OK).json(newOrder);
                // });
            }
            catch (err) {
                console.log(err);
                res.status(http_status_codes_1.BAD_REQUEST).json({
                    error: err
                });
            }
        });
    }
    getOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.orderId;
            yield db_1.db('orders').select()
                .where({ id: id })
                .then(order => {
                res.status(200).json({
                    order: order,
                    request: {
                        type: 'GET',
                        url: `http://localhost:8080/orders/${id}`
                    }
                });
            });
        });
    }
    deleteOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.orderId;
                const order = yield db_1.db('orders')
                    .where({ id: id })
                    .del();
                res.status(http_status_codes_1.OK).json({
                    message: 'Order DELETED',
                    order: order,
                    request: {
                        type: 'GET',
                        url: `http://localhost:8080/orders/${id}`
                    }
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            }
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.router.get('/', this.getOrders);
            this.router.post('/', this.createOrder);
            this.router.get('/:orderId', this.getOrder);
            this.router.delete('/:orderId', this.deleteOrder);
        });
    }
}
const order = new OrderRouter();
exports.orerRouter = order.router;
//# sourceMappingURL=orders.js.map