import type { MessageBroker } from '../bondaries/message-broker';
import { SNS } from 'aws-sdk';

export class SnsMessageBroker implements MessageBroker {
    private sns: SNS;

    public constructor() {
        this.sns = new SNS();
    }

    public async publish(topic: string, message: any): Promise<void> {
        const { MessageId } = await this.sns
            .publish({
                Message: JSON.stringify(message),
                TargetArn: topic,
                MessageGroupId: '01',
            })
            .promise();

        if (MessageId) {
            console.log(`${MessageId} - ${JSON.stringify(message)}`);
            return;
        }
        console.log(`fail to publish this message: ${JSON.stringify(message)}`);
    }
}
