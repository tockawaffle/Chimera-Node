import axios, {
    AxiosInstance,
    AxiosProxyConfig,
    RawAxiosRequestHeaders,
} from "axios";
import { Agent } from "https";
import { HttpsProxyAgent } from "https-proxy-agent";

import { ProxyConfig, ProxyServiceInstance } from "../../types/index";

/**
 * @class InstanceHandler
 * @classdesc This class provides an instance handling for axios with proxy support.
 */

export default class InstanceHandler {
    private static readonly instances: Map<string, ProxyServiceInstance> =
        new Map();

    private readonly instanceTimeout = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    baseURL: string;
    headers: RawAxiosRequestHeaders;
    proxyConfig: ProxyConfig | undefined;
    debugLogging: boolean;

    /**
     * @constructor
     * @param {string} baseURL - The base URL for axios instance
     * @param {RawAxiosRequestHeaders} headers - The headers for axios instance
     * @param {ProxyConfig} proxyConfig - The configuration for proxy settings
     */
    constructor(
        baseURL: string,
        headers: RawAxiosRequestHeaders,
        proxyConfig?: {
            host: string;
            port: number;
            protocol: "http" | "https";
            auth?: { username: string; password: string };
        },
        debugLogging?: boolean
    ) {
        this.baseURL = baseURL;
        this.headers = headers;
        this.debugLogging = debugLogging || false;
        const get = this.getProxyConfig(proxyConfig);
        if (get) {
            this.proxyConfig = get;
        } else {
            this.proxyConfig = undefined;
        }
    }

    /**
     * Get an axios instance with proxy settings
     * @return {Promise<AxiosInstance>} The axios instance
     */
    async getInstance(): Promise<AxiosInstance> {
        let instanceInfo = InstanceHandler.instances.get(this.baseURL);

        if (!instanceInfo || instanceInfo.instance === undefined) {
            const axiosInstance = await this.createProxy();
            instanceInfo = {
                instance: axiosInstance,
                isOnline: undefined,
                timeoutId: undefined,
            };
            InstanceHandler.instances.set(this.baseURL, instanceInfo);
        }

        if (instanceInfo.isOnline === undefined && instanceInfo.instance) {
            if (this.proxyConfig) {
                instanceInfo.isOnline = await this.isProxyOnline({
                    ...this.proxyConfig,
                });
            }
            if (!instanceInfo.isOnline) {
                instanceInfo.instance = undefined;
                const instance: AxiosInstance = axios.create();
                instanceInfo = {
                    instance: instance,
                    isOnline: undefined,
                    timeoutId: undefined,
                };
                InstanceHandler.instances.set(this.baseURL, instanceInfo);
                if (this.debugLogging) {
                    console.log(
                        `[ Instance Handler ] > Proxy is offline. Skipping proxy config. . .`
                    );
                }
            }
        }

        if (instanceInfo.timeoutId) {
            clearTimeout(instanceInfo.timeoutId);
        }
        instanceInfo.timeoutId = setTimeout(() => {
            InstanceHandler.instances.delete(this.baseURL);
        }, this.instanceTimeout);

        instanceInfo.instance!.defaults.baseURL = this.baseURL;
        instanceInfo.instance!.defaults.headers.common = this.headers;

        return instanceInfo.instance as AxiosInstance;
    }

    /**
     * Validate the configuration of the proxy
     * @param {Partial<ProxyConfig>} data - The configuration to be validated
     * @return {Object} The validation results, including a flag of the validation result and an array of invalid keys
     */
    private validateProxyConfig(data: Partial<ProxyConfig>): {
        isValid: boolean;
        invalidKeys: string[];
    } {
        const validators: Record<string, (value: any) => boolean> = {
            host: (value) => typeof value === "string",
            port: (value) => typeof value === "number",
            auth: (value) =>
                value === undefined ||
                (typeof value.username === "string" &&
                    typeof value.password === "string"),
            protocol: (value) =>
                value === undefined || ["http", "https"].includes(value),
        };

        const missingKeys: string[] = [];
        const invalidKeys: string[] = [];

        Object.entries(validators).forEach(([key, validator]) => {
            const value = (data as any)[key];
            if (value === undefined || value.length === 0) {
                missingKeys.push(key);
            } else if (!validator(value)) {
                invalidKeys.push(key);
            }
        });

        const isValid = missingKeys.length === 0 && invalidKeys.length === 0;

        return {
            isValid,
            invalidKeys: isValid ? [] : [...missingKeys, ...invalidKeys],
        };
    }

    /**
     * Check if the proxy is online by sending a GET request to Google
     * @param {ProxyConfig} data - The configuration for the proxy settings
     * @return {Promise<boolean>} A promise that resolves to a boolean, indicating whether the proxy is online
     */
    private async isProxyOnline(data: ProxyConfig): Promise<boolean> {
        const proxyConfig = {
            host: data.host!,
            port: data.port!,
            auth: data.auth,
            protocol: data.protocol!,
        } as AxiosProxyConfig;
        try {
            let instance: AxiosInstance;
            if (data.protocol === "http") {
                if (data.auth) {
                    instance = axios.create({
                        httpsAgent: new HttpsProxyAgent(
                            `http://${data.auth.username}:${data.auth.password}@${data.host}:${data.port}`
                        ),
                        proxy: false,
                        timeout: 5000,
                    });
                } else {
                    instance = axios.create({
                        httpsAgent: new HttpsProxyAgent(
                            `http://${data.host}:${data.port}`
                        ),
                        timeout: 5000,
                    });
                }
            } else {
                instance = axios.create({
                    proxy: proxyConfig,
                    timeout: 5000,
                });
            }

            const response = await instance.get("https://www.google.com/");

            if (response.status === 200) {
                return true;
            }
        } catch (error: any) {
            console.error(
                `[ Proxy Service - Online Check ] > ${error.message}`
            );
            return false;
        }

        return false;
    }

    /**
     * Create a proxy for the axios instance
     * @return {Promise<AxiosInstance>} A promise that resolves to the axios instance or undefined if the creation fails
     */
    private async createProxy(): Promise<AxiosInstance> {
        let axiosInstance: AxiosInstance;
        if (this.proxyConfig) {
            let { host, port, protocol, auth } = this.proxyConfig;

            const { isValid, invalidKeys } = this.validateProxyConfig({
                host,
                port,
                protocol,
                auth,
            });

            if (!isValid) {
                if (this.debugLogging) {
                    console.log(
                        `[ Instance Handler ] > Invalid proxy config: ${invalidKeys.join(
                            ", "
                        )}\nSkipping proxy config and using default axios instance. . .`
                    );
                }
                return axios.create();
            }

            if (protocol === "http") {
                let proxyAgent;
                if (auth && auth.username && auth.password) {
                    proxyAgent = new HttpsProxyAgent(
                        `http://${auth.username}:${auth.password}@${host}:${port}`
                    );
                } else {
                    proxyAgent = new HttpsProxyAgent(`http://${host}:${port}`);
                }

                axiosInstance = axios.create({
                    httpsAgent: proxyAgent,
                    proxy: false,
                });
            } else {
                axiosInstance = axios.create({
                    proxy: {
                        host,
                        port,
                        auth,
                    },
                    httpsAgent: new Agent({ rejectUnauthorized: false }),
                });
            }
        } else {
            axiosInstance = axios.create();
        }
        return axiosInstance;
    }

    /**
     *
     * @param {ProxyConfig} proxyConfig - The proxy config to use
     * @param {number} proxyConfigFile.useConfig - The index of the proxy to use
     * @returns
     */
    private getProxyConfig(
        proxyConfig: ProxyConfig | undefined
    ): ProxyConfig | undefined {
        if (proxyConfig) {
            let { host, port, protocol, auth } = proxyConfig;

            host = host;
            port = port;
            auth = auth || {
                username: auth!.username,
                password: auth!.password,
            };
            protocol = protocol;

            return { host, port, protocol, auth };
        }
    }
}
