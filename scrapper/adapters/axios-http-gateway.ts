import axios from 'axios';
import type { HttpGateway } from '../bondaries/http-gateway';

export class AxiosHttpGateway implements HttpGateway {
    public async get(url: string): Promise<string> {
        const response = await axios.get(url);
        if (typeof response.data === 'string') {
            return response.data;
        }
        return '';
    }
}
