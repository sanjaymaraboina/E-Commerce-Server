const  mongoose = require('mongoose')

const cartSchema  = new  mongoose.Schema({
    isapply : {type :  Boolean , required : true},
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      quantity: { type: Number, required: true, default: 1 }
})


module.exports =  mongoose.model('Cart', cartSchema) ;
