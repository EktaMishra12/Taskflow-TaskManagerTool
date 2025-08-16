import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const TOKEN_EXPIRATION = "24h";

const createToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
};


// @desc    Register a new user
export async function registerUser(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please fill all fields" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }
    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        const token = createToken(user._id);

        res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email }, message: "User created successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// @desc    Login user
export async function loginUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please Enter Email and password..." });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Password" });
        }
        const token = createToken(user._id);
        res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email }, message: "User logged in successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// @desc    Get user profileq

export async function getUserProfile(req, res) {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select(",name  email password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Update user profile
export async function updateUserProfile(req, res) {
    const userId = req.user.id;
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ success: false, message: "Please fill all fields" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }
    try {
        const existsingUser = await User.findOne({ email, _id: { $ne: userId } });

        if (existsingUser) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true, runValidators: true, select: "name email" });
        res.status(200).json({ success: true, user, message: "User updated successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Change user password
export async function changeUserPassword(req, res) {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Please fill all fields" });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid old password" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// @desc    Delete user profile
export async function deleteUserProfile(req, res) {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        await user.remove();
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};