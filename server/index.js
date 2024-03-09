require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

//middle-ware
app.use(cors());
app.use(express.json());//req.body


//Routes

//Register and Login Routes
app.use("/auth", require("./routes/jwtAuth"));
//product routes
app.use("/product",require("./routes/product_router"));
app.use("/customer",require("./routes/customer_router"));
app.use("/seller",require("./routes/seller"));
app.use("/courier",require("./routes/courier_router"));
app.use("/search_product",require("./routes/search_product"));
app.use("/message",require("./routes/message_router"));
app.use("/customer_care",require("./routes/customer_care_router"));
app.use("/search_product_with_order",require("./routes/search_product_with_order"));
//app.use("/order",require("./routes/order"));
const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});