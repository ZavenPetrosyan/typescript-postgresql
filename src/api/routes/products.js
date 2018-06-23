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
class ProductRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    //================get all products===============
    getProducts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.db.select('id', 'name', 'decription', 'price')
                    .from("products");
                const response = {
                    count: result.length,
                    products: result
                };
                res.status(http_status_codes_1.OK).json(response);
            }
            catch (err) {
                res.status(http_status_codes_1.BAD_REQUEST).json({
                    error: err
                });
            }
        });
    }
    //===============create product==================
    createProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = {
                id: req.body.id,
                createdAt: new Date(),
                name: req.body.name,
                decription: req.body.decription,
                price: req.body.price
            };
            try {
                const newProduct = yield db_1.db("products")
                    .insert(product, '*');
                res.status(http_status_codes_1.CREATED).json({
                    message: "product post",
                    createProduct: newProduct
                });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    //==============get product==============
    getProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.productId;
            const result = yield db_1.db("products")
                .select()
                .where({ id: id })
                .then(product => {
                console.log(product);
                if (product) {
                    res.status(http_status_codes_1.OK).json(product);
                }
                else {
                    res.status(http_status_codes_1.NOT_FOUND).json({
                        message: 'Not found'
                    });
                }
            });
        });
    }
    //================update product===============
    updateProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.productId;
                db_1.db("products").where({ id: id })
                    .update({
                    updatedAt: new Date,
                    name: req.body.name || null,
                    decription: req.body.decription || null,
                    price: req.body.price || null
                })
                    .returning('updatedAt')
                    .then((data) => {
                    res.status(http_status_codes_1.OK).json(data);
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
    //=================delete product===============
    deleteProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.productId;
            if (typeof id != 'undefined') {
                const product = yield db_1.db("products")
                    .where({ id: id })
                    .del()
                    .then(() => {
                    res.status(http_status_codes_1.OK).json({ message: 'product deleted' });
                })
                    .catch(err => console.log(err));
            }
        });
    }
    init() {
        this.router.get('/', this.getProducts);
        this.router.post('/', this.createProduct);
        this.router.get('/:productId', this.getProduct);
        this.router.put('/:productId', this.updateProduct);
        this.router.delete('/:productId', this.deleteProduct);
    }
}
exports.ProductRouter = ProductRouter;
const router = new ProductRouter();
exports.productRouter = router.router;
//# sourceMappingURL=products.js.map