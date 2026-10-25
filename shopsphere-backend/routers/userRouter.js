import express from 'express'
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import {users} from "../users.js"
import bcrypt from "bcryptjs"
import { generateToken, isAuth } from '../utils.js';

const userRouter = express.Router();


userRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const count = await User.countDocuments();
    if (count > 0) {
      return res.status(400).send({
        message: "Users already seeded. Seeding is only permitted when the database is empty.",
      });
    }
    const createdUsers = await User.insertMany(users);
    res.send({ createdUsers });
  })
);

// Ensure default admin user admin@gmail.com exists with password admin123
export const ensureAdminUser = async () => {
  try {
    let admin = await User.findOne({ email: "admin@gmail.com" });
    if (!admin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "ShopSphere Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        isAdmin: true,
      });
      console.log("Default admin account ensured: admin@gmail.com");
    } else if (!admin.isAdmin) {
      admin.isAdmin = true;
      await admin.save();
    }
  } catch (err) {
    console.warn("Could not auto-ensure default admin account:", err.message);
  }
};

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const { email, password, role } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : "";

    // Auto-create or repair admin credentials if signing in as admin@gmail.com
    if (normalizedEmail === "admin@gmail.com") {
      let admin = await User.findOne({ email: "admin@gmail.com" });
      if (!admin) {
        admin = await User.create({
          name: "ShopSphere Admin",
          email: "admin@gmail.com",
          password: await bcrypt.hash("admin123", 10),
          isAdmin: true,
        });
      } else {
        const matches = await bcrypt.compare(password, admin.password);
        if (!matches && password === "admin123") {
          admin.password = await bcrypt.hash("admin123", 10);
          admin.isAdmin = true;
          await admin.save();
        }
      }
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        if (role === "admin" && !user.isAdmin) {
          return res.status(403).send({
            message: "Access denied. This account does not have administrator privileges.",
          });
        }

        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }

    res.status(401).send({ message: "Invalid email or password." });
  })
);

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).send({ message: "A user with this email address already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const createdUser = await user.save();
    res.status(201).send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      token: generateToken(createdUser),
    });
  })
);


userRouter.get('/:id', expressAsyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id);

    if(user){
        res.send(user);
    }
    else{
        res.status(404).send({
            message: 'User not found'
        })
    }
}));



userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    }
  })
);



export default userRouter;