"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail', // Or your SMTP provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
/**
 * Send an email
 * @param to Recipient email
 * @param subject Email subject
 * @param html HTML content of the email
 */
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: `"Ryo" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };
        const info = yield transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
        return true;
    }
    catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
});
exports.sendEmail = sendEmail;
