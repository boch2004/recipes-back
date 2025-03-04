const mongoose=require("mongoose");
const schema=mongoose.Schema;


const productSchema = new schema({
    titel:String,
    img:String,
    description:String,
    Ingredients:Array,
    Directions:Array,
    category:{type:String,default:"all"},
    chef:String,
    idchef:String
});


const Product = mongoose.model('Product', productSchema);
module.exports=Product;