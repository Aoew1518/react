import OpenAI from "openai";

console.log(process.env.NEXT_PUBLIC_BASE_URL);

const client = new OpenAI({
    // baseURL: process.env.BASE_URL,
    // apiKey: process.env.API_KEY
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    apiKey: process.env.NEXT_PUBLIC_API_KEY
});

export default client