require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./src/models/Product");

const categories = [
    "Electronics",
    "Books",
    "Fashion",
    "Sports",
    "Gaming"
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        await Product.deleteMany({});
        console.log("Existing products deleted");

        const products = [];

        for (let i = 1; i <= 200000; i++) {
            const randomCategory =
                categories[Math.floor(Math.random() * categories.length)];

            products.push({
                name: `Product ${i}`,
                category: randomCategory
            });
        }

        await Product.insertMany(products);

        console.log(`${products.length} products inserted successfully`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Seed Error:", error.message);
        process.exit(1);
    }
};

seedProducts();