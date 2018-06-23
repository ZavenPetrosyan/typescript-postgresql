"use strict";
import { Request, Response, Router, NextFunction } from 'express';
import {db} from '../../config/database/db';
import { BAD_REQUEST, OK } from 'http-status-codes';

class OrderRouter {
    router: Router;
    constructor() {
        this.router = Router();
        this.init();
    }
    public async getOrders ( req: Request, res: Response, next: NextFunction ): Promise<void> {
        try {
          const result = await db('orders').select("*")
          .then(docs => {
          res.status(OK).json({
              count: docs.length,
              orders: docs
          });
        })
        }
        catch(err) {
            console.log(err);
            res.status(BAD_REQUEST).json({
                error: err
            });
        }
    }
    public async createOrder ( req: Request, res: Response, next: NextFunction ): Promise<void> {
       const order = {
           createdAt: new Date(),
           productsid: req.body.productsid,
           quantity: req.body.quantity
       }
       try {
        const newOrder = await db("orders")
        .insert(order, '*')
        .innerJoin('products', 'order.orderId', 'orders.productsid')
        res.status(OK).json(newOrder)
        // .then(() => {
        //     res.status(OK).json(newOrder);
        // });
       }catch(err) {
        console.log(err);
        res.status(BAD_REQUEST).json({
            error: err
        });
       }
    }
    public async getOrder ( req: Request, res: Response, next: NextFunction ): Promise<void> {
       const id = req.params.orderId;
        await db('orders').select()
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
    }
    public async deleteOrder ( req: Request, res: Response, next: NextFunction ): Promise<void> {
        try {
            const id: number =  req.params.orderId;
            const order = await db('orders')
            .where({ id:id })
            .del()
            res.status(OK).json({
                message: 'Order DELETED',
                order: order,
                request: {
                    type: 'GET',
                    url: `http://localhost:8080/orders/${id}`
                }
            });
        }catch(err) {
            console.log(err);
            res.status(500).json({
                error:  err
            });
        }
    }
    async init() {
        this.router.get('/', this.getOrders);
        this.router.post('/', this.createOrder);
        this.router.get('/:orderId', this.getOrder);
        this.router.delete('/:orderId', this.deleteOrder);
    }
}

const order = new OrderRouter();
export const orerRouter = order.router;