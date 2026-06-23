// Template.ts
export const ForgotPasswordTemplate = ({ name, resetLink, }) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:30px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                       style="background:#ffffff;border-radius:10px;overflow:hidden;">

                    <tr>
                        <td align="center"
                            style="background:#2563eb;padding:30px;">
                            <h1 style="margin:0;color:white;">
                                Password Reset Request
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:40px;">
                            <h2 style="margin-top:0;color:#333;">
                                Hello ${name},
                            </h2>

                            <p style="font-size:16px;color:#555;line-height:1.6;">
                                We received a request to reset the password for your account.
                            </p>

                            <p style="font-size:16px;color:#555;line-height:1.6;">
                                Click the button below to create a new password.
                            </p>

                            <div style="text-align:center;margin:35px 0;">
                                <a href="${resetLink}"
                                   style="
                                        background:#2563eb;
                                        color:white;
                                        text-decoration:none;
                                        padding:14px 28px;
                                        border-radius:6px;
                                        display:inline-block;
                                        font-size:16px;
                                        font-weight:bold;
                                   ">
                                    Reset Password
                                </a>
                            </div>

                            <p style="font-size:15px;color:#555;">
                                ⏰ This link will expire in
                                <strong>15 minutes</strong>.
                            </p>

                            <p style="font-size:15px;color:#555;">
                                If you didn't request a password reset, you can safely ignore this email.
                            </p>

                            <p style="font-size:14px;color:#555;">
                                If the button doesn't work, copy and paste the link below into your browser:
                            </p>

                            <p style="word-break:break-all;color:#2563eb;">
                                ${resetLink}
                            </p>

                            <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;">

                            <p style="font-size:14px;color:#888;">
                                Regards,<br/>
                                Job Portal Team
                                Chetan Sharma
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center"
                            style="padding:20px;background:#fafafa;color:#999;font-size:12px;">
                            © ${new Date().getFullYear()} Job Portal. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
};
