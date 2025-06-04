import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
})

export const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: 'amansamyotech@gmail.com',
    to: email,
    subject: '🔐 Your OTP Code for Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Hello,</h2>
        <p style="font-size: 16px; color: #555;">
          You requested to reset your password. Use the OTP below to proceed:
        </p>
        <div style="margin: 20px 0; padding: 10px; background: #f4f4f4; border-left: 5px solid #4CAF50;">
          <p style="font-size: 28px; font-weight: bold; color: #000; text-align: center;">${otp}</p>
        </div>
        <p style="font-size: 14px; color: #999;">
          This OTP will expire in <strong>10 minutes</strong>. If you didn't request this, please ignore the email.
        </p>
        <p style="font-size: 14px; color: #333;">Thanks,<br/>Your Company Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
