(async () => {

    const ChimeraModule = await import("chimera-api");

    const Chimera = ChimeraModule.default;

    const apiKey = "YOUR_API_KEY";

    const chimera = new Chimera(apiKey);

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
    process.exit(0);
})();
