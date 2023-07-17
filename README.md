# Introduction

This project is a simple script for interacting with the Chimera API. The main class is `Chimera`, and it has methods for chat completion, image generation, text-to-speech generation, and content moderation.

The Proxy handler is 100% not a thing to be used with a single API, but I am lazy and didn't want to rework the whole thing to accomodate for this single wrapper. So I just made it a thing. If you want to use it, you can. If you don't, you don't have to. This is an open-source project, so feel free to fork it and make your own changes.

Why axios and not fetch?: Built-in fetch does not support proxies, which is a requirement for me, and since Axios is really easy to use, I just went with it.

Why would you use this?: Let's be honest, if you're here you're lazy to make your own wrapper. I get it. I am too. So I made this. You're welcome.

## Requirements

-   Node.js.
-   Common Sense.

## Installation

Install the project using npm:

```bash
npm install chimera-api
```

## Usage

This is an ESM module, you won't be able to use it with `require()`. You will need to use `import` instead:

```javascript
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
```

First, import the `Chimera` class:

```javascript
import Chimera from "chimera-api";
```

Create a new instance of the class with your API key:

```javascript
const chimera = new Chimera("your_api_key");
```

If you need to use a proxy, provide a configuration object as the second parameter to the constructor:

```javascript
const chimera = new Chimera("your-api-key", {
    host: "proxy-host",
    port: "proxy-port",
    protocol: "http",
    auth: {
        username: "proxy-username",
        password: "proxy-password",
    }, // optional
});
```

You can then use the class methods as follows:

### Chat Completion

```javascript
let chatCompletionRequest = {
    model: "gpt-4",
    messages: [{ role: "user", content: "Hello" }],
    // other properties...
};
chimera
    .chatCompletion(chatCompletionRequest)
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
```

### Image Generation

```javascript
let imageRequest = {
    prompt: "E G G.",
    // other properties...
};
chimera
    .imageGeneration(imageRequest)
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
```

### Text-To-Speech Generation

```javascript
let ttsRequest = {
    text: "Hello, world!",
};
chimera
    .textToSpeech(ttsRequest)
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
```

### Content Moderation

```javascript
chimera
    .Moderation("some potentially offensive text")
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
```

There are also some examples on the `test` folder.

## Disclaimer

This project is licensed under the GNU General Public License v3.0.

Please note that this is not an official project of the developers of Chimera. This was made out of personal interest and may be helpful to others. This comes with no guarantees or support, but feel free to use it as you wish within the bounds of the license.

Enjoy!

me made dis :)
