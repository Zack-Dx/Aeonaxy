import { Resend } from 'resend';
import { CONFIG } from '../config/index.js';

const resend = new Resend(CONFIG.MAILER_API_KEY);

export const sendResetPasswordEmail = (receiver, resetPassToken) => {
    const url = `http://localhost:5001/api/user/reset-pass/${receiver.id}/${resetPassToken}`;

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <p style="font-size: 16px;">Hello ${receiver.name},</p>
            <p style="font-size: 16px;">We received a request to reset your password. If you didn't request this, you can safely ignore this email.</p>
            <p style="font-size: 16px;">To reset your password, please click the following link:</p>
            <p style="font-size: 16px; margin-bottom: 20px;"><a href="${url}" style="text-decoration: none; color: #007bff; font-weight: bold;">Reset Password</a></p>
            <p style="font-size: 16px;">If you're having trouble clicking the link, you can copy and paste the following URL into your browser's address bar:</p>
            <p style="font-size: 16px; margin-bottom: 20px;">${url}</p>
            <p style="font-size: 16px;">Thank you,</p>
            <p style="font-size: 16px;">The Resend Team</p>
        </div>
    `;

    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: receiver.email,
        subject: 'Reset Password',
        html: htmlContent,
    });
};

export const sendEnrollmentSuccessMail = (receiver, courseName) => {
    const htmlContent = `
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f2f2f2;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #fff;
                    border-radius: 5px;
                    padding: 20px;
                }
                h2 {
                    color: #333;
                }
                p {
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Course Enrollment Successful</h2>
                <p>Hello ${receiver.name},</p>
                <p>You have successfully enrolled in the course "${courseName}".</p>
                <p>Enjoy your learning!</p>
            </div>
        </body>
    </html>
`;

    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: receiver.email,
        subject: 'Course Enrollment',
        html: htmlContent,
    });
};

export const sendUserRegistrationSuccessEmail = (receiver) => {
    const htmlContent = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f2f2f2;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        border-radius: 5px;
                        padding: 20px;
                    }
                    h2 {
                        color: #333;
                    }
                    p {
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Welcome to Our Platform, ${receiver.name}!</h2>
                    <p>Thank you for registering with us.</p>
                    <p>We're excited to have you on board.</p>
                    <p>If you have any questions or need assistance, feel free to contact us.</p>
                    <p>Best regards,</p>
                    <p>The Team</p>
                </div>
            </body>
        </html>
    `;

    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: receiver.email,
        subject: 'User Registration',
        html: htmlContent,
    });
};
