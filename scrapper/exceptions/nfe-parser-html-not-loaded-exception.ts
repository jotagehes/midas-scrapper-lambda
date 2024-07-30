export class NFEParserHTMLNotLoadedException extends Error {
    public constructor() {
        super('HTML not loaded on Nfe Parser');
    }
}
