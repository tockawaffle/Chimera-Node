import { AxiosInstance, AxiosProxyConfig } from "axios";
import InstanceHandler from "./tools/ProxyService.js";
import {
    CreateChimeraChatCompletionRequest,
    ChatCompletionResponse,
    CreateChimeraImageRequest,
    ImageResponse,
    CreateChimeraTextToSpeechRequest,
    TextToSpeechResponse,
    ModerationResponse,
} from "../types";

export default class Chimera {
    apiKey: string;
    private proxy: AxiosProxyConfig | undefined;
    private debugLogging: boolean;
    /**
     * Constructor for the Chimera class
     * @constructor
     * @param {string} apiKey - The API key for the Chimera API
     * @throws {Error} Will throw an error if no API key is provided
     */
    constructor(
        apiKey: string,
        proxy?: AxiosProxyConfig,
        debugLogging: boolean = false
    ) {
        if (!apiKey || apiKey === "") {
            throw new Error("No Chimera API key was provided.");
        } else {
            this.apiKey = apiKey;
        }

        if (proxy) {
            this.proxy = proxy;
        } else {
            this.proxy = undefined;
        }

        this.debugLogging = debugLogging;
    }

    /**
     * Private method to get an Axios instance for API interactions
     * @private
     * @returns {Promise<AxiosInstance>} A promise that resolves to an Axios instance
     */
    private async getInstance(): Promise<AxiosInstance> {
        if (this.proxy) {
            return await new InstanceHandler(
                "https://chimeragpt.adventblocks.cc/v1",
                {
                    Authorization: `Bearer ${this.apiKey}`,
                },
                {
                    host: this.proxy.host,
                    port: this.proxy.port,
                    protocol: this.proxy.protocol as "http" | "https",
                    auth: this.proxy.auth,
                },
                this.debugLogging
            ).getInstance();
        } else {
            return await new InstanceHandler(
                "https://chimeragpt.adventblocks.cc/v1",
                {
                    Authorization: `Bearer ${this.apiKey}`,
                }
            ).getInstance();
        }
    }

    /**
     * Private method to handle API errors
     * @private
     * @param {any} error - The error object
     * @throws {Error} Will throw an error with either the server's response error message or the error message
     */

    private handlerError(error: any): never {
        if (error.response) {
            throw new Error(error.response.data);
        } else {
            throw new Error(error.message);
        }
    }

    /**
     * Private method to handle streaming data
     * @private
     * @param {CreateChimeraChatCompletionRequest} data - The chat completion request object
     * @param {AxiosInstance} instance - The Axios instance to use
     * @returns {Promise<string>} A promise that resolves to a string response from the server
     */
    private handleStream(
        data: CreateChimeraChatCompletionRequest,
        instance: AxiosInstance
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            instance
                .post("chat/completions", data, {
                    responseType: "stream",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    let data = "";
                    response.data.on(
                        "data",
                        (chunk: string) => (data += chunk)
                    );
                    response.data.on("end", () => resolve(data));
                    response.data.on("error", reject);
                })
                .catch(reject);
        });
    }

    /**
     * Public method to get a chat completion
     * @public
     * @param {CreateChimeraChatCompletionRequest} data - The chat completion request object
     * @returns {Promise<string | ChatCompletionResponse>} A promise that resolves to either a string (if streaming) or a ChatCompletionResponse object
     */
    public async chatCompletion(
        data: CreateChimeraChatCompletionRequest
    ): Promise<string | ChatCompletionResponse> {
        try {
            const client = await this.getInstance();

            if (data.stream) {
                return await this.handleStream(data, client);
            } else {
                const response = await client.post("chat/completions", data);
                return response.data;
            }
        } catch (error: any) {
            return this.handlerError(error);
        }
    }

    /**
     * Public method to generate an image
     * @public
     * @param {CreateChimeraImageRequest} data - The image generation request object
     * @returns {Promise<ImageResponse>} A promise that resolves to an ImageResponse object
     */
    public async imageGeneration(
        data: CreateChimeraImageRequest
    ): Promise<ImageResponse> {
        try {
            const client = await this.getInstance();

            const response = await client.post("images/generations", data);

            return response.data.data;
        } catch (error) {
            return this.handlerError(error);
        }
    }

    /**
     * Public method to generate a text-to-speech audio file
     * @public
     * @param {CreateChimeraTextToSpeechRequest} data - The text-to-speech request object
     * @returns {Promise<TextToSpeechResponse>} A promise that resolves to a TextToSpeechResponse object
     */
    public async textToSpeech(
        data: CreateChimeraTextToSpeechRequest
    ): Promise<TextToSpeechResponse> {
        try {
            const client = await this.getInstance();
            const response = await client.post("audio/tts/generation", data);
            return response.data;
        } catch (error) {
            return this.handlerError(error);
        }
    }

    // public async Whisper(
    //     data: WhisperRequest,
    //     endpoint?: "audio/transcriptions" | "audio/translations"
    // ): Promise<any> {
    //     const { file, fileName, language } = data;
    //     const client = await this.getInstance();

    //     try {
    //         const formData = new FormData();
    //         formData.append("file", file, {
    //             filename: fileName,
    //             contentType: "audio/aac",
    //         });
    //         formData.append("model", "whisper-1");
    //         formData.append("response_format", "json");
    //         formData.append("language", language);
    //         // const readFile = readFileSync(filePath, { encoding: "base64" });
    //         // const response = await client.post(
    //         //     endpoint ?? "audio/translations",
    //         //     readFile
    //         // );
    //         // return response.data;
    //     } catch (error) {
    //         return this.handlerError(error);
    //     }
    // }

    /**
     * Public method to moderate content
     * @public
     * @param {string} input - The text to be moderated
     * @returns {Promise<ModerationResponse>} A promise that resolves to a ModerationResponse object
     */
    public async Moderation(input: string): Promise<ModerationResponse> {
        const client = await this.getInstance();
        try {
            const response = await client.post("moderations", { input });
            return response.data;
        } catch (error) {
            return this.handlerError(error);
        }
    }
}
