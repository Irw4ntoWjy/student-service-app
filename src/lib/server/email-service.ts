import { Resend } from 'resend';

const resend = new Resend('re_SQq3uV8e_2d165QcEn1qnn1BUoDW6HZsf');

export const sendVerificationEmail = async (toEmail: string, verificationCode: string) => {
	const { data, error } = await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: toEmail,
		subject: 'Your Verification Code',
		html: ` 
		<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
			<h2 style="color: #333;">Your Verification Code</h2>
			<p style="font-size: 16px; color: #555;">Use the code below to verify your account:</p>
			<div style="font-size: 24px; font-weight: bold; padding: 15px; background-color: #007bff; color: #fff; border-radius: 5px; display: inline-block; margin: 10px 0;">
			${verificationCode}
			</div>
			<p style="font-size: 14px; color: #777;">If you didn’t request this code, you can ignore this email.</p>
			<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
			<p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
      	</div>
		`
	});

	if (error) {
		return console.error({ error });
	}

	console.log({ data });
};
