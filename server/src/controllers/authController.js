import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { userStore, isMongoConnected } from '../utils/storage.js';

const generateToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET || 'supersecretjwtkey', { expiresIn: '7d' });

const getUserModel = async () => (isMongoConnected() ? User : null);

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const UserModel = await getUserModel();
    const existingUser = UserModel ? await UserModel.findOne({ email }) : await userStore.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = UserModel
      ? await UserModel.create({ name, email, password: hashedPassword })
      : await userStore.create({ name, email, password: hashedPassword });

    res.status(201).json({
      token: generateToken(user._id || user.id),
      user: { id: user._id || user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const UserModel = await getUserModel();
    const user = UserModel ? await UserModel.findOne({ email }) : await userStore.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(user._id || user.id),
      user: { id: user._id || user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
