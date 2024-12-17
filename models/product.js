const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productname: {type : String, required : true},
  category : {type : String, required : true, },
  description : {type : String, required : true, },
  Price : {type : Number, required : true},
  imageUrl: { type: Array, required: true }, 

  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }

});

module.exports = mongoose.model('Product', ProductSchema);


