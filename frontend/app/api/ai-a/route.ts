import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

import { APIRequest } from "../../types";

export async function POST(request: Request) {

    const data: APIRequest = await request.json();
    const { messages, persons, apiKey } = data;
    const configuration = new Configuration({
        apiKey,
    });
    const openai = new OpenAIApi(configuration);

    const prompts = messages?.map((message) => {
        return {
            role: "user" as any,
            content: `${message.user} said: ${message.text}`,
        };
    });

    const system = {
        role: "system",
        content: persons.personA.setting,
    };

    const completion = await openai
        .createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages?.length ? [system, ...prompts] : [system],
        })
        .catch((err) => {
            console.log(err);
        });

    const generatedText = completion!.data.choices[0].message?.content.trim();
    console.log(generatedText);
    return NextResponse.json({ user: persons.personA.name, text: generatedText });
}
