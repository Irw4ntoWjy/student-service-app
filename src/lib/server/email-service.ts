import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: 'smtp.office365.com',
	port: 587,
	secure: false,
	auth: {
		user: 'student-service-uph@outlook.com',
		pass: 'igzkpfifsedcxjfo'
	}
});

export const sendVerificationEmail = async (toEmail: string, verificationCode: string) => {
	const mailOptions = {
		from: 'student-service-uph@outlook.com',
		to: toEmail,
		subject: 'Your Verification Code',
		text: `Your verification code is: ${verificationCode}`,
		html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log('Email sent: ', info.response);
		return true;
	} catch (error) {
		console.error('Error sending email:', error);
		return false;
	}
};
