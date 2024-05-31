import { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

dotenv.config();

const MODEL_NAME = 'gemini-1.5-flash';
const API_KEY = process.env.API_KEY as string;

if (!API_KEY) {
	throw new Error('API_KEY is not defined in environment variables.');
}

interface GenerationConfig {
	temperature: number;
	topK: number;
	topP: number;
	maxOutputTokens: number;
}

interface SafetySetting {
	category: HarmCategory;
	threshold: HarmBlockThreshold;
}

interface Part {
	text: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const genAI = new GoogleGenerativeAI(API_KEY);
	const model = await genAI.getGenerativeModel({ model: MODEL_NAME });

	console.log('API route reached'); // Debugging log

	const generationConfig: GenerationConfig = {
		temperature: 1,
		topK: 64,
		topP: 0.95,
		maxOutputTokens: 8192,
	};

	const safetySettings: SafetySetting[] = [
		{
			category: HarmCategory.HARM_CATEGORY_HARASSMENT,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
			threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
		},
	];

	const parts: Part[] = [
		{ text: 'Generate three five-letter words where each letter from one word does not appear in the other two words. The words should be separated by commas and there should be no other output. Whenever "new" is input, provide a new set of such words.' },
		{ text: "input: new" },
		{ text: "output: brain,ghost,mucky" },
		{ text: "input: new" },
		{ text: "output: frock,quail,beach" },
		{ text: "input: new" },
		{ text: "output: brick,spool,whack" },
		{ text: "input: new" },
		{ text: "output: crane,flock,yucky" },
	];

	const result = await model.generateContent({
		contents: [{ role: 'user', parts }],
		generationConfig,
		safetySettings,
	});

	const response = result.response;
	res.status(200).json({ result: response.text() });
}
