import type { HttpGateway } from '../bondaries/http-gateway';
import type { MessageBroker } from '../bondaries/message-broker';
import type { NfeParser } from '../bondaries/nfe-parser';

type Input = {
    url: string;
};

export class ExtractAndPublishNfeUseCase {
    public constructor(
        readonly httpGateway: HttpGateway,
        readonly nfeParser: NfeParser,
        readonly messageBroker: MessageBroker,
    ) {}

    public async execute({ url }: Input): Promise<void> {
        const html = await this.httpGateway.get(url);
        const nfeData = this.nfeParser.getData(html);
        console.log(nfeData);

        await this.messageBroker.publish('arn:aws:sns:us-east-1:381492193067:nfe-data-parsed.fifo', nfeData);
    }
}
