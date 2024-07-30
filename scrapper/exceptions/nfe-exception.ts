export class NFEExeception extends Error {
    public constructor() {
        super('Fail to parse nfe data');
    }
}
