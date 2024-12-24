const express = require('express')
const app = express();
const cors = require('cors');

require('./db/connection')



const paymentRoutes = require("./Routes/paymentRoutes");

const userRoutes = require('./Routes/userRoutes')
const adminRoutes = require('./Routes/adminRoutes')
const productRoutes = require('./Routes/productRoutes')
const cartRoutes =require('./Routes/cartRoutes')
const wishRoutes =require('./Routes/wishRoutes')
const checkoutRoutes = require('./Routes/checkoutRoutes');
const { port } = require('./constants/constants');



app.use(express.json())

app.use(cors())

app.get("/",(req,res)=>{
    res.send("hello")
})

app.use("/api/v1/user", userRoutes)

app.use("/api/v1/admin", adminRoutes)

app.use("/api/v1/user",productRoutes)


app.use("/api/v1/admin",productRoutes)

app.use("/api/v1/user",cartRoutes)

app.use("/api/v1/user",wishRoutes)

app.use("/api/v1/user",checkoutRoutes)

app.use("/api/v1/user", paymentRoutes); 


app.listen(port , ()=>{
    console.log(`server is running at port ${port}`);
})
