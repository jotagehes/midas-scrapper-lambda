import { snsClient, PublishCommand } from './aws-client-sdk.mjs';
import { TOPIC_ARN, MESSAGE_GROUP_ID } from './const.mjs';

export default async function snsPublisher(msgData) {
    const input = {
        Message: JSON.stringify(msgData),
        TopicArn: TOPIC_ARN,
        MessageGroupId: MESSAGE_GROUP_ID,
    }

    const command = new PublishCommand(input);
    await snsClient.send(command);
};
