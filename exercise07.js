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
    select(statement) {
        const regexp = /select (.+) from ([\w]+)(?: where (.+))?/;
        const parsedStatement = regexp.exec(statement);
        const [,columnsList, tableName, filter] = parsedStatement;
        let selectedData = this.tables[tableName].data;
        if (filter) {
            const parsedFilter = filter.split(' = ');
            const [filterColumn, filterValue] = parsedFilter;
            selectedData = selectedData.filter(row => row[filterColumn] === filterValue);
        }
        const columns = columnsList.split(', ');
        selectedData = selectedData.map(row => {
                const rowSelectColumns = {};
                columns.forEach(column => rowSelectColumns[column] = row[column]);
                return rowSelectColumns;
            });
        return selectedData;
    },
    delete(statement) {
        const regexp = /delete from ([\w]+)(?: where (.+))?/;
        const parsedStatement = regexp.exec(statement);
        const [, tableName, filter] = parsedStatement;
        let rows = this.tables[tableName].data;
        if (!filter) rows = [];
        else {
            const parsedFilter = filter.split(' = ');
            const [filterColumn, filterValue] = parsedFilter;
            rows = rows.filter(row => row[filterColumn] !== filterValue);
        }
        this.tables[tableName].data = rows;
    },
    execute(statement) {
        if (statement.startsWith('create table')) return this.createTable(statement);
        if (statement.startsWith('insert into')) return this.insert(statement);
        if (statement.startsWith('delete')) return this.delete(statement);
        if (statement.startsWith('select')) return this.select(statement);
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
    database.execute("delete from author where id = 2");
    const select1 = database.execute("select name, age from author");
    const select2 = database.execute("select name, age from author where id = 1");
    console.log(JSON.stringify(database, undefined, ' '));
    console.log(select1);
    console.log(select2);
}
catch (e) {
    console.log(e.error);
}
