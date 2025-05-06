import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  name: { type: String, default: "" },
  email: { type: String, default: "", unique: true, sparse: true },
  phone: { type: String, default: "" },
});

export default mongoose.model("User", userSchema);
