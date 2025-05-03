import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
  image: String,
});

export default mongoose.model("Product", productSchema);
