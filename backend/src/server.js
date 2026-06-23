const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

connectDB();

const app = express();
app.use(cors({ origin: "https://product-browser-ten.vercel.app/"}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API Running");
});

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});