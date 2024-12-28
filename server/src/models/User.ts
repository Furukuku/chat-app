import { model, Schema } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
}, {
  timestamps: true,
});

export default model('User', userSchema);