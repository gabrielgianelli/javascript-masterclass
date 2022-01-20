const database = {
    tables: {},
    createTable(statement) {
        const regexp = /create table ([\w]+) \(([\w ]+[, \w]*)\)/;
        const result = regexp.exec(statement);
        const tableName = result[1];
        this.tables[tableName] = {
            columns: {},
            data: []
        }
        const columnsList = result[2];
        const columns = columnsList.split(',');
        for (let column of columns) {
            column = column.trim().split(' ');
            const name = column[0];
            const type = column[1];
            this.tables[tableName].columns[name] = type;
        }
    },
    execute(statement) {
        if (statement.startsWith('create table')) return this.createTable(statement);
        throw new DatabaseError(statement, 'Syntax error');
    }
};
const DatabaseError = function (statement, message) {
    this.statement = statement;
    this.message = message;
    this.error = `${this.message}: '${this.statement}'`;
}
const statementCreateTable = 'create table author (id number, name string, age number, city string, state string, country string)';
const statementSelect = 'select id, name from author';
try{
    database.execute(statementCreateTable);
    database.execute(statementSelect);
    console.log(JSON.stringify(database, undefined, ' '));
}
catch (e) {
    console.log(e.error);
}
