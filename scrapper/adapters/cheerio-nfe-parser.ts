import { load, type CheerioAPI, type Element } from 'cheerio';
import type { NfeData, NfeItem, NfeParser } from '../bondaries/nfe-parser';
import { NFEParserHTMLNotLoadedException } from '../exceptions/nfe-parser-html-not-loaded-exception';
import { NFEExeception } from '../exceptions/nfe-exception';

export class CheerioNfeParser implements NfeParser {
    private html: CheerioAPI | null;

    public constructor() {
        this.html = null;
    }

    public getData(html: string): NfeData {
        this.html = load(html);

        return {
            nfeId: this.getId(),
            supermarketName: this.getSupermarketName(),
            cnpj: this.getCNPJ(),
            address: this.getAddress(),
            date: this.getDate(),
            items: this.getItems(),
        };
    }

    private getId(): string {
        if (this.html === null) {
            throw new NFEParserHTMLNotLoadedException();
        }
        const element = this.html('tbody tr td');

        const IdMatch = element
            .text()
            .match(
                /\d{2}-\d{2}\/\d{2}-\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}-\d{2}-\d{3}-\d{3}\.\d{3}\.\d{3}-\d{3}\.\d{3}\.\d{4}/,
            );
        if (IdMatch === null) {
            throw new NFEExeception();
        }
        return IdMatch[0];
    }

    private getSupermarketName(): string {
        if (this.html === null) {
            throw new NFEParserHTMLNotLoadedException();
        }
        return this.html('thead h4 b').text();
    }

    private getCNPJ(): string {
        if (this.html === null) {
            throw new NFEParserHTMLNotLoadedException();
        }
        const element = this.html('tbody tr td').first();
        const cnpjMatch = element.text().match(/\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/);
        if (cnpjMatch === null) {
            throw new NFEExeception();
        }
        return cnpjMatch[0];
    }

    private getAddress(): string {
        if (this.html === null) {
            throw new NFEParserHTMLNotLoadedException();
        }
        return this.html('tbody tr td').eq(1).text();
    }

    private getDate(): Date {
        if (this.html === null) {
            throw new NFEParserHTMLNotLoadedException();
        }
        const dataMatch = this.html('.table-hover  tbody tr td')
            .text()
            .match(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/);
        if (dataMatch === null) {
            throw new NFEParserHTMLNotLoadedException();
        }
        return this.parseDate(dataMatch[0]);
    }

    private parseDate(dateString: string): Date {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    private getItems(): NfeItem[] {
        if (this.html === null) {
            throw new NFEParserHTMLNotLoadedException();
        }
        const items = this.html('#myTable tr').map(this.parseItemsTableRow.bind(this)).get();
        return items;
    }

    private parseItemsTableRow(_index: number, element: Element) {
        if (this.html === null) {
            throw new NFEParserHTMLNotLoadedException();
        }
        const columns = this.html(element)
            .find('td')
            .map((_idx, td) => (this.html as CheerioAPI)(td).text().trim())
            .get();

        const match: { [key: string]: RegExpMatchArray | null } = {
            nameMatch: columns[0].match(/^(.*?)\s*\(Código: \d+\)$/),
            codeMatch: columns[0].match(/Código: (\d+)/),
            qtyMatch: columns[1].match(/Qtde total de ítens: (\d+\.\d+)/),
            totoalPriceMatch: columns[3].match(/\b\d*,\d*\b/),
        };

        for (let key in match) {
            if (match[key] === null) {
                throw new NFEExeception();
            }
        }

        return {
            name: (match.nameMatch as RegExpMatchArray)[1],
            code: (match.codeMatch as RegExpExecArray)[1],
            price:
                parseFloat((match.totoalPriceMatch as RegExpExecArray)[0].split(',').join('.')) /
                parseFloat((match.qtyMatch as RegExpExecArray)[1]),
        };
    }
}
