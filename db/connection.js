const mongoose = require('mongoose')


mongoose.connect("mongodb+srv://sanjaymaraboina:akWk488wusFMmrMj@cluster0.h8uzy.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("Connection established")
})

.catch((err)=>{
    console.log(`Error is  : ${err}`);
})

