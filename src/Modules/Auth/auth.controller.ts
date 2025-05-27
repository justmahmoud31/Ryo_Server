import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient, Role } from "@prisma/client";
import { sendEmail } from "../../Config/mailService";
// import logo from '../../Public/ryo.jpg';
const LOGO_URL = 'https://i.postimg.cc/vg2hgxWL/ryo.jpg'; // Update with actual public URL
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: +201012204095
 *               password:
 *                 type: string
 *                 example: password123
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already registered
 */
const register = async (req: Request, res: Response) => {
  try {
    const { email, password, phoneNumber, firstName, lastName } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: "USER",
        phoneNumber,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error });
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      data: {
        token,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};


const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match)
      return res.status(400).json({ message: "Old password incorrect" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Password change failed", error });
  }
};
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent to email
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to send OTP
 */
const sendResetOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // expires in 15 mins

    await prisma.user.update({
      where: { email },
      data: {
        resetOtp: otp,
        resetOtpExpires: otpExpiry,
      },
    });

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <title>Password Reset OTP</title>
    <style>
      body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
      padding: 40px 0;
      }
      .container {
      max-width: 600px;
      margin: 0 auto;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
      overflow: hidden;
      border: 1px solid #e3e3e3;
      }
      .header {
      background: linear-gradient(90deg, #2980b9 0%, #6dd5fa 100%);
      padding: 32px 0 16px 0;
      text-align: center;
      }
      .header img {
      width: 100px;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(41,128,185,0.15);
      margin-bottom: 12px;
      }
      .header h2 {
      color: #fff;
      margin: 0;
      font-size: 2rem;
      letter-spacing: 1px;
      text-shadow: 0 2px 8px rgba(41,128,185,0.15);
      }
      .content {
      padding: 32px 32px 24px 32px;
      text-align: center;
      }
      .content p {
      color: #444;
      font-size: 1.1rem;
      margin-bottom: 18px;
      }
      .otp {
      display: inline-block;
      background: linear-gradient(90deg, #6dd5fa 0%, #2980b9 100%);
      color: #fff;
      font-size: 2.2rem;
      font-weight: bold;
      letter-spacing: 8px;
      padding: 16px 32px;
      border-radius: 12px;
      margin: 18px 0 18px 0;
      box-shadow: 0 4px 16px rgba(41,128,185,0.12);
      border: 2px dashed #fff;
      transition: background 0.3s;
      }
      .content .expire {
      color: #888;
      font-size: 0.98rem;
      margin-bottom: 8px;
      }
      .content .note {
      color: #b2bec3;
      font-size: 0.95rem;
      }
      .footer {
      background: #f1f1f1;
      padding: 18px;
      text-align: center;
      font-size: 0.95rem;
      color: #999;
      border-top: 1px solid #e3e3e3;
      }
      .footer a {
      color: #2980b9;
      text-decoration: none;
      font-weight: 500;
      }
    </style>
    </head>
    <body>
    <div class="container">
      <div class="header">
      <img src="${LOGO_URL}" alt="Ryo Egypt Logo" />
      <h2>Password Reset Request</h2>
      </div>
      <div class="content">
      <p>
        We received a request to reset your password.<br>
        Please use the one-time password (OTP) below to proceed:
      </p>
      <div class="otp">${otp}</div>
      <div class="expire">
        This OTP will expire in <b>15 minutes</b>.
      </div>
      <div class="note">
        If you did not initiate this request, please disregard this email.
      </div>
      </div>
      <div class="footer">
      &copy; ${new Date().getFullYear()} Ryo Egypt. All rights reserved.<br />
      <a href="https://ryo-egypt.com">www.ryo-egypt.com</a>
      </div>
    </div>
    </body>
    </html>
  `;


    await sendEmail(email, "Reset Password OTP", html);

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP", error });
  }
};
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewSecurePass123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 *       500:
 *         description: Password reset failed
 */

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (
      !user.resetOtp ||
      user.resetOtp !== otp ||
      !user.resetOtpExpires ||
      new Date(user.resetOtpExpires) < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetOtp: null,
        resetOtpExpires: null,
      },
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Password reset failed', error });
  }
};
export default {
  register,
  changePassword,
  resetPassword,
  sendResetOTP,
  login,
};
