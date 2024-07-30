export type NfeItem = {
    name: string;
    code: string;
    price: number;
};

export type NfeData = {
    nfeId: string;
    supermarketName: string;
    cnpj: string;
    address: string;
    date: Date;
    items: NfeItem[];
};

export interface NfeParser {
    getData(html: string): NfeData;
}
