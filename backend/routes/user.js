const express = require("express");
const bcrypt = require("bcrypt");
const user = require("../models/user");
const mongoose = require("mongoose");

const userRouter = express.Router();

// User Registration
userRouter.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "missing required field",
                details: {
                    email: !email ? "email is required" : null,
                    password: !password ? "password is required" : null
                }
            });
        }
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "email already exists",
                details: {
                    email: existingUser.email === email ? "email already in use" : null
                }
            });
        }
        const saltRounds = 4;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const User = new user({ email, password: hashedPassword });
        await User.save();
        res.status(200).json({ message: "user created successfully" });
    } catch (error) {
        return res.status(401).json({ message: "error in user creation" });
    }
});

// User Login
userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const User = await user.findOne({ email });
        if (!User || !(await bcrypt.compare(password, User.password))) {
            return res.status(400).json({ message: "invalid email or password" });
        }
        res.json({ message: "login successfull" });
    } catch (error) {
        return res.status(400).json({ message: "error in loggin" });
    }
});

// List Encrypted Files Uploaded by Admin
userRouter.get("/files", async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'admin_files' });

const files = await db.collection('encryptedFiles.files').find().toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ message: "No encrypted files found" });
        }

        const fileList = files.map(file => ({
            filename: file.filename,
            uploadDate: file.uploadDate,
            fileId: file._id
        }));

        res.status(200).json({ files: fileList });
    } catch (error) {
        console.error("Error fetching files:", error.message);
        res.status(500).json({ message: "Failed to fetch files", error: error.message });
    }
});

module.exports = userRouter;
