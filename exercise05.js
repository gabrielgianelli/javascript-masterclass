const database = {
    tables: {},
    createTable(statement) {
        const regexp = /create table ([\w]+) \((.+)\)/;
        const parsedStatement = regexp.exec(statement);
        const [,tableName, columnsList] = parsedStatement;
        this.tables[tableName] = {
            columns: {},
            data: []
        }
        const columns = columnsList.split(',');
        for (let column of columns) {
            column = column.trim().split(' ');
            const [name, type] = column;
            this.tables[tableName].columns[name] = type;
        }
    },
    insert(statement) {
        const regexp = /insert into ([\w]+) \((.+)\) values \((.+)\)/;
        const parsedStatement = regexp.exec(statement);
        const [,tableName, columnsList, valuesList] = parsedStatement;
        const columns = columnsList.split(',');
        const values = valuesList.split(',');
        const row = {};
        if (columns.length === values.length) {
            for (let idx in columns) {
                const column = columns[idx].trim();
                const value = values[idx].trim();
                row[column] = value; 
            }       
            this.tables[tableName].data.push(row);
        }
    },
    execute(statement) {
        if (statement.startsWith('create table')) return this.createTable(statement);
        if (statement.startsWith('insert into')) return this.insert(statement);
        throw new DatabaseError(statement, 'Syntax error');
    }
};
const DatabaseError = function (statement, message) {
    this.statement = statement;
    this.message = message;
    this.error = `${this.message}: '${this.statement}'`;
}
const statementCreateTable = 'create table author (id number, name string, age number, city string, state string, country string)';
try{
    database.execute(statementCreateTable);
    database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
    database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
    database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");
    console.log(JSON.stringify(database, undefined, ' '));
}
catch (e) {
    console.log(e.error);
}
