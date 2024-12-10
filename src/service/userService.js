import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/user.js';

import * as dotenv from 'dotenv' 
dotenv.config()

// Signup: Create a new user
export async function createUserService(req) {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return { error: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash: hashedPassword });

    return user
}

// Login: Authenticate user and generate token
export async function loginService(req) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return {messge: 'User not found'};
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
        return {message:'Invalid credentials' };
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token }
}

export async function verifyAndLogin(token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
        const user = await User.findOne({ where: { id: decoded.id, email: decoded.email } });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
