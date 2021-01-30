const _ = require('lodash');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.createProduct = (req, res) => {
    const productData = new Product(req.body);
    productData.save((err, product) => {
        if (err) {
            return res.status(400).json({
                error: 'Something went wrong'
            });
        }
        res.json({
            product
        });
    });
};

exports.getProduct = (req, res) => {
    let productId = req.params.productId;
    Product.findById(productId,(err, product) => {
        if (err) {
            return res.status(400).json({
                error: 'Something went wrong'
            });
        }
        res.json({
            product
        });
    });
};

exports.deleteProduct = (req, res) => {
    let productId = req.params.productId;
    console.log(productId)
    Product.remove({"_id":productId},(err, product) => {
        if (err) {
            return res.status(400).json({
                error: 'Something went wrong'
            });
        }
        res.json({
            message: 'Product deleted successfully.'
        });
    });
};

exports.updateProduct = (req, res) => {
    let userData = req.body;
    var myquery = { "_id": userData._id};
    delete userData._id
    var newvalues = { $set: userData };
    Product.updateOne(myquery,newvalues,(err, product) => {
        if (err) {
            return res.status(400).json({
                error: 'Something went wrong'
            });
        }
        res.json({
            message: 'Product updated successfully.'
        });
    });
};

exports.listProducts = (req, res) => {
    Product.find((err, products) => {
        if (err) {
            return res.status(400).json({
                error: 'Something went wrong'
            });
        }
        res.json({
            products
        });
    });
};


