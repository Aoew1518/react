import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    apiKey: process.env.NEXT_PUBLIC_API_KEY
});

export default openai