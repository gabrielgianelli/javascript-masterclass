export default class DatabaseError {
    constructor (statement, message) {
        this.statement = statement;
        this.message = message;
        this.error = `${this.message}: '${this.statement}'`;
    };
}
