const mongoose = require("mongoose");
const Product = require("../models/Product");

const createProduct = async (req, res) => {
    try {
        const { name, category } = req.body;

        const product = new Product({
            name,
            category
        });

        const savedProduct = await product.save();

        res.status(201).json({
            success: true,
            product: savedProduct
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        const cursor = req.query.cursor;
        const limit = Number(req.query.limit) || 20;

        let filter = {};

        if (cursor) {
            filter._id = {
                $lt: new mongoose.Types.ObjectId(cursor)
            };
        }

        if (category) {
            filter.category = category;
        }

        const products = await Product.find(filter)
            .sort({
                createdAt: -1,
                _id: -1
            })
            .limit(limit);

        const nextCursor =
            products.length > 0
                ? products[products.length - 1]._id.toString()
                : null;

        res.json({
            success: true,
            count: products.length,
            nextCursor,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createProduct,
    getProducts
};