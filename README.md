[![npm version](https://badge.fury.io/js/chimera-api.svg)](https://badge.fury.io/js/chimera-api)
[![wakatime](https://wakatime.com/badge/user/e0979afa-f854-452d-b8a8-56f9d69eaa3b/project/52a6f116-57ff-4560-a203-1bf98b42e716.svg)](https://wakatime.com/badge/user/e0979afa-f854-452d-b8a8-56f9d69eaa3b/project/52a6f116-57ff-4560-a203-1bf98b42e716)

# Introduction

This project is a simple script for interacting with the Chimera API. The main class is `Chimera`, and it has methods for chat completion, image generation, text-to-speech generation, and content moderation.

## Requirements

-   Node.js.
-   Common Sense.

## Installation

Install the project using npm:

```bash
npm install chimera-api
```

## Usage

<details>
    <summary> CommonJS Compatibility </summary>

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
---
</details>

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

Any other model that you want to use might follow this code aswell.

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

### Whisper Interaction

<details>
<summary> Translate </summary>

```javascript
chimera
    .Whisper(
        {
            file: createReadStream("./path/to/file.mp3"),
            fileName: "name.mp3",
            language: "pt-BR",
        },
        "audio/translations"
    )
```

</details>

<details>
<summary> Transcription </summary>

```javascript
chimera
    .Whisper(
        {
            file: createReadStream("./path/to/file.mp3"),
            fileName: "name.mp3",
            language: "pt-BR",
        },
        "audio/transcriptions"
    )
```
</details>

There are also some examples on the `test` folder.

### Support and Others

<details>
<summary> Performance Related Stuff </summary>
<br>

### Proxy Handler:

The Proxy handler is 100% not a thing to be used with a single API: It provides advanced management of Axios instances, such as per-URL instance caching and optional proxy support. Originally, it was designed for managing multiple API endpoints, hence the proxy handler might seem over-engineered for a single API wrapper. It's optional and doesn't affect the main functionality if not utilized.

TLDR: The Proxy Handler is way too overengineered for a single API wrapper, but it's optional and doesn't affect the main functionality if not utilized.

---

</details>

<details>
    <summary> Support </summary>

### Where do I find support?

Mainly on the [Discord Server](https://discord.gg/chimeragpt)
You can also create an issue if what you're facing is an error from this package. (Please, do not ask for help on the discord if this is a package-related issue, this is not in any way attributed to the main devs on Chimera.)

</details>

## Disclaimer

This project is licensed under the GNU General Public License v3.0.

Please note that this is not an official project of the developers of Chimera. This was made out of personal interest and may be helpful to others. This comes with no guarantees or support, but feel free to use it as you wish within the bounds of the license.

Enjoy!

me made dis :)
