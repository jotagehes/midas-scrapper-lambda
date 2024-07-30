import { it, expect } from '@jest/globals';
import type { SQSEvent } from 'aws-lambda';
import { lambdaHandler } from './app';

it('deve extrair os dados de uma nfe e publica-los em um topico sns', async () => {
    const event: SQSEvent = {
        Records: [
            {
                messageId: '059f36b4-87a3-44ab-83d2-661975830a7d',
                receiptHandle: 'AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...',
                body: '{"url": "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240500830498000110650010001161201067328154%7C2%7C1%7C1%7C6EDCF28F8E346B24BAF885F49736DAC96040B02F"}',
                attributes: {
                    ApproximateReceiveCount: '1',
                    SentTimestamp: '1545082649183',
                    SenderId: 'AIDAIENQZJOLO23YVJ4VO',
                    ApproximateFirstReceiveTimestamp: '1545082649185',
                },
                messageAttributes: {},
                md5OfBody: 'e4e68fb7bd0e697a0ae8f1bb342846b3',
                eventSource: 'aws:sqs',
                eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
                awsRegion: 'us-east-2',
            },
        ],
    };

    await expect(lambdaHandler(event)).resolves.toBeUndefined();
});
