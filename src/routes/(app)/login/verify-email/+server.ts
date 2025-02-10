import { sendVerificationEmail } from '$lib/server/email-service';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { email, code } = await request.json();

	await sendVerificationEmail(email, code);

	return json({
		message: 'Verification email sent successfully'
	});
};
