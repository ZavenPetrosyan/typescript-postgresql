"use strict";
import { Request, Response, Router, NextFunction } from 'express';
import { db } from '../../config/database/db';
import { OK, BAD_REQUEST, CREATED, NOT_FOUND } from 'http-status-codes';
import { verifyToken } from '../../middlewere/check-auth';

export class ProductRouter {
    router: Router;
    constructor() {
        this.router = Router();
        this.init();
    }
    
    //================get all products===============
    public async getProducts( req: Request, res: Response, next: NextFunction ): Promise<void> {
        try {
            const result = await db.select('id', 'name', 'decription', 'price')
            .from("products")
            const response = {
                count: result.length,
                products: result
            }
        res.status(OK).json(response)
        } catch(err) {
            res.status(BAD_REQUEST).json({
               error: err 
            });
        }
    }

    //===============create product==================
    public async createProduct( req: Request, res: Response, next: NextFunction ): Promise<void> {
        const product =  {
            id: req.body.id,
            createdAt: new Date(),
            name: req.body.name,
            decription: req.body.decription,
            price: req.body.price
        }
       try {
         const newProduct = await db("products")
         .insert(product, '*')
         res.status(CREATED).json({ 
             message: "product post",
             createProduct: newProduct
         });
       }catch (err){
            console.log(err);
       }  
    }

    //==============get product==============
    public async getProduct( req: Request, res: Response, next: NextFunction ): Promise<void> {
        const id: any = req.params.productId;
        const result = await db("products")
        .select()
        .where({ id: id })
        .then(product => {
            console.log(product);
            if (product) {
                res.status(OK).json(product);
            } else {
                res.status(NOT_FOUND).json({
                    message: 'Not found'
                });
            }
        });
    }

    //================update product===============
    public async updateProduct( req: Request, res: Response, next: NextFunction ): Promise<void> {
        try {
            const id: any = req.params.productId;
            db("products").where({ id: id })
            .update({
                updatedAt: new Date,
                name: req.body.name || null,
                decription: req.body.decription || null,
                price: req.body.price || null
            })
        .returning('updatedAt')
        .then((data) => {
            res.status(OK).json(data);
        });  
    } catch(err) {
        console.log(err);
        res.status(BAD_REQUEST).json({
            error: err
        });
    }
}

    //=================delete product===============
    public async deleteProduct (req: Request, res: Response, next: NextFunction ): Promise<void> {
        const id: any = req.params.productId;
        if (typeof id != 'undefined') {
            const product = await db("products")
            .where({ id: id })
            .del()
            .then(() => {
                res.status(OK).json({ message: 'product deleted' });
            })
            .catch(err => console.log(err));
        }
    }
    init() {
        this.router.get('/', this.getProducts);
        this.router.post('/', this.createProduct);
        this.router.get('/:productId', this.getProduct);
        this.router.put('/:productId', this.updateProduct);
        this.router.delete('/:productId', this.deleteProduct);
    }
}

const router = new ProductRouter();
export const productRouter = router.router;