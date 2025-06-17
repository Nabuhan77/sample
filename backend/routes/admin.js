const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { Readable } = require("stream");
const fetch = require("node-fetch");
const admin = require("../models/admin");
const bcrypt = require("bcrypt");
const multer = require("multer");

const adminRouter = express.Router();

// Admin Registration
adminRouter.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "missing required fields",
                details: {
                    email: !email ? "email is required" : null,
                    password: !password ? "password is required" : null
                }
            });
        }
        const existingAdmin = await admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                message: "admin already exists",
                details: {
                    email: existingAdmin.email === email ? "email is already in use" : null
                }
            });
        }
        const saltRounds = 4;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const Admin = new admin({ email, password: hashedPassword });
        await Admin.save();
        res.status(200).json({ message: "admin created successfully" });
    } catch (error) {
        res.status(401).json({ message: "error in creating admin" });
    }
});

// Admin Login
adminRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const Admin = await admin.findOne({ email });
        if (!Admin || !(await bcrypt.compare(password, Admin.password))) {
            return res.status(401).json({ message: "invalid email or password" });
        }
        res.json({ message: "login successfull" });
    } catch (error) {
        res.status(401).json({ message: "error in login" });
    }
});

// File Upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });
adminRouter.post("/upload", upload.single('uploaded_file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "no files uploaded" });
        }
        console.log("Uploaded file info:", req.file);
        res.status(200).json({ message: "file uploaded successfully", file: req.file });
    } catch (error) {
        res.status(400).json({ message: "error in uploading files" });
    }
});

// Generate RSA Key Pair (2048-bit)
async function generateRSAKeyPair() {
    return new Promise((resolve, reject) => {
        crypto.generateKeyPair('rsa', {
            modulusLength: 2048,
            publicExponent: 0x10001,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }
        }, (err, publicKey, privateKey) => {
            if (err) return reject(err);
            resolve({ publicKey, privateKey });
        });
    });
}

// Try to get 32 bytes from ANU QRNG; fallback to local entropy
async function getAESKeyFromQRNG() {
    try {
        const response = await fetch("https://qrng.anu.edu.au/API/jsonI.php?length=32&type=uint8");
        const data = await response.json();
        if (!data.success) throw new Error("QRNG failed");
        return Buffer.from(data.data);
    } catch (err) {
        console.warn("⚠️ QRNG failed, using local AES key");
        return crypto.randomBytes(32);
    }
}

// Hybrid Encryption Route
adminRouter.post("/encrypt", async (req, res) => {
    try {
        const { files } = req.body;
        if (!files || !Array.isArray(files) || files.length === 0) {
            return res.status(400).json({ message: "Please provide an array of filenames to encrypt" });
        }

        const uploadPath = path.join(__dirname, "..", "uploads");
        const db = mongoose.connection.db;
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'encryptedFiles' });

        const { publicKey, privateKey } = await generateRSAKeyPair();
        console.log("\uD83D\uDD10 PRIVATE KEY:\n", privateKey);

        for (const filename of files) {
            const filePath = path.join(uploadPath, filename);
            if (!fs.existsSync(filePath)) {
                console.warn(`\u26A0\uFE0F File not found: ${filename}`);
                continue;
            }

            const fileBuffer = fs.readFileSync(filePath);

            // Step 1: Generate AES Key using QRNG or fallback
            const aesKey = await getAESKeyFromQRNG();
            const iv = crypto.randomBytes(16);

            // Step 2: Encrypt file with AES
            const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
            const encryptedFile = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
            const authTag = cipher.getAuthTag();

            // Step 3: Encrypt AES key with RSA
            const encryptedKey = crypto.publicEncrypt(publicKey, aesKey);

            // Step 4: Combine and store encrypted data
            const payload = JSON.stringify({
                iv: iv.toString('hex'),
                authTag: authTag.toString('hex'),
                encryptedKey: encryptedKey.toString('base64'),
                encryptedData: encryptedFile.toString('base64')
            });

            const readable = new Readable();
            readable.push(payload);
            readable.push(null);

            const uploadStream = bucket.openUploadStream(filename + ".hybrid.enc");
            readable.pipe(uploadStream);
        }

        res.status(200).json({
            message: "Selected files encrypted using hybrid method and stored in MongoDB successfully",
            encryptedFiles: files.map(f => f + ".hybrid.enc")
        });
    } catch (error) {
        console.error("\u274C Encryption Error:", error.message);
        res.status(500).json({ message: "Encryption failed", error: error.message });
    }
});

module.exports = adminRouter;
