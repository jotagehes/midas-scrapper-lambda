import srapper from './src/scrapper.mjs';
import snsPublisher from './src/sns-publisher.mjs';

export const lambdaHandler = async (event) => {
    for (const record of event.Records) {
        const messageBody = JSON.parse(record.body);
        const url = messageBody.Message;

        const data = await srapper(url);
        await snsPublisher(data);
    }
};