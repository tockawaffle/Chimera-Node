import { ReadStream } from "fs";

export interface Auth {
    username: string;
    password: string;
}

export interface ProxyConfig {
    host: string;
    port: number;
    auth?: Auth;
    protocol: "http" | "https";
}

export interface ProxyServiceInstance {
    instance: AxiosInstance;
    isOnline: boolean | undefined;
    timeoutId: NodeJS.Timeout | undefined;
}

export type Models =
    | "gpt-4"
    | "gpt-4-32k"
    | "gpt-4-0613"
    | "gpt-3.5-turbo"
    | "gpt-3.5-turbo-16k"
    | "gpt-3.5-turbo-openai"
    | "gpt-3.5-turbo-16k-openai"
    | "gpt-3.5-turbo-poe"
    | "gpt-3.5-turbo-16k-poe"
    | "gpt-4-poe"
    | "gpt-4-32k-poe"
    | "sage"
    | "claude-instant"
    | "claude-2-100k"
    | "claude-instant-100k"
    | "chat-bison-001";

export interface Messages {
    role: "user" | "assistant" | "system" | "function";
    content?: string;
    name?: string;
    function_call?: string;
}

export interface Functions {
    name: string;
    description: string;
    parameters: {
        [key: string]: any;
    };
}

export interface CreateChimeraChatCompletionRequest {
    model: Models;
    messages: Array<Messages>;
    functions?: Array<Functions>;
    function_call?: string;
    temperature?: number;
    top_p?: number;
    n?: number;
    stream?: boolean;
    stop?: Array<string> | string;
    max_tokens?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    logit_bias?: Object;
    user?: string;
}

export interface CreateChimeraImageRequest {
    prompt: string;
    n?: number;
    size?: "1024x1024" | "512x512" | "256x256";
    response_format?: "url" | "b64_json";
    user?: string;
}

export interface CreateChimeraTextToSpeechRequest {
    text: string;
}

export interface WhisperRequest {
    file: ReadStream;
    fileName: string;
    language: string;
}

export interface ChatCompletionResponse {
    data?: {
        id: string;
        object: "chat.completion";
        created: number;
        model: Models;
        choices: Array<Messages>;
        usage: {
            completion_tokens: number;
            prompt_tokens: number;
            total_tokens: number;
        };
    };
}

export interface ImageResponse {
    data?: Array<{ url: string }>;
}

export interface TextToSpeechResponse {
    data?: {
        url: string;
    };
}

interface ModerationCategories {
    sexual: boolean;
    hate: boolean;
    harassment: boolean;
    "self-harm": boolean;
    "sexual/minors": boolean;
    "hate/threatening": boolean;
    "violence/graphic": boolean;
    "self-harm/intent": boolean;
    "self-harm/instructions": boolean;
    "harassment/threatening": boolean;
    violence: boolean;
}

interface ModerationCategoryScores {
    sexual: number;
    hate: number;
    harassment: number;
    "self-harm": number;
    "sexual/minors": number;
    "hate/threatening": number;
    "violence/graphic": number;
    "self-harm/intent": number;
    "self-harm/instructions": number;
    "harassment/threatening": number;
    violence: number;
}

interface ModerationResults {
    flagged: boolean;
    categories: ModerationCategories;
    category_scores: Array<ModerationCategories>;
}

export interface ModerationResponse {
    id: string;
    model: string;
    results: Array<ModerationResults>;
}
