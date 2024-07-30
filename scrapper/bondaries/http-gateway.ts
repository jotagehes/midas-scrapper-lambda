export interface HttpGateway {
    get(url: string): Promise<string>;
}
