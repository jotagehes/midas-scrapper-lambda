export interface MessageBroker {
    publish(topic: string, message: any): Promise<void>;
}
