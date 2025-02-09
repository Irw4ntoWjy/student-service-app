import express from 'express';
import { sendVerificationEmail } from './email-service';

const app = express();
app.use(express.json());

app.post('/send-email', async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({ message: 'Email is required' });
	}

	const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
	await sendVerificationEmail(email, verificationCode);

	res.json({ message: 'Email sent', verificationCode });
});

app.listen(3000, () => {
	console.log('Server running on http://localhost:3000');
});
