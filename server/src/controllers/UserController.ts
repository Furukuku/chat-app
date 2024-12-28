import { Request, Response } from "express";
import { validate } from "../helpers/validation";
import User, { IUser } from "../models/User";
import { signToken } from "../helpers/token";
import { compare, hash } from "../helpers/hash";
import { AuthRequest } from "../middlewares/auth";

interface UserData extends IUser {
  confirmPassword: string;
}

export const create = async (req: Request, res: Response) => {
  try {
    const validator = await validate<UserData>({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    },
    {
      name: ['required', 'string', 'max:50'],
      email: ['required', 'string', 'email', 'unique', 'max:100'],
      password: ['required', 'string', 'min:8', 'max:100', 'confirmed:confirmPassword'],
      confirmPassword: ['required', 'string', 'min:8', 'max:100']
    });

    if (validator.passed) {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: await hash(req.body.password)
      });

      if (user) {
        const token = signToken({ id: user._id, name: user.name });
        res.status(201).json({ message: 'Registered successfully.', token });
        return;
      }
    }

    res.status(422).json({ errors: validator.errors });
    return;
  } catch (err) {
    res.status(500).json({ error: err });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validator = await validate({
      email: req.body.email,
      password: req.body.password
    }, {
      email: ['required', 'string'],
      password: ['required', 'string']
    });
    
    if (validator.passed) {
      const user = await User.findOne({ email: req.body.email });
      
      if (user && user.password) {
        const isCorrectPass = await compare(req.body.password, user.password);
        
        if (isCorrectPass) {
          const token = signToken({ id: user._id, name: user.name });
          res.status(200).json({ message: 'Login successfully.', token });
          return;
        }
      }

      res.status(401).json({ errors: { incorrect: 'The email or password is incorrect.' } });
      return;
    }

    res.status(422).json({ errors: validator.errors });
    return;
  } catch (err) {
    res.status(500).json({ error: err });
    return;
  }
};

export const index = async (req: AuthRequest, res: Response) => {
  try {
    if (req.userId) {
      const user = await User.findById(req.userId, { _id: true, name: true, email: true });

      if (user) {
        res.status(200).json({ user });
        return;
      }
    }

    res.status(401).send('Unauthenticated');
    return;
  } catch (err) {
    res.status(500).json({ error: err });
    return;
  }
};