import Chimera from "chimera-api";
import { createReadStream } from "fs";

(async () => {
    const apiKey = "Your_API_Key";
    const chimera = new Chimera(apiKey);

    async function chatCompletion() {
        const createChatCompletion = await chimera.chatCompletion({
            model: "gpt-4",
            messages: [
                {
                    content: "Hello, how are you?",
                    role: "user",
                },
            ],
        });

        console.log(createChatCompletion);
    }

    async function whisper() {
        try {
            const whisper = await chimera.Whisper(
                {
                    file: createReadStream("./tests/typescript/test2.mp3"),
                    fileName: "test2.mp3",
                    language: "pt-BR",
                },
                "audio/translations"
            );

            console.log(whisper);
        } catch (error: any) {
            console.log(error);
        }
    }

    await whisper();
    process.exit(0);
})();
