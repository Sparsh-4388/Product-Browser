const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

ProductSchema.index({
    category: 1,
    createdAt: -1,
    _id: -1
});

module.exports = mongoose.model("Product", ProductSchema);