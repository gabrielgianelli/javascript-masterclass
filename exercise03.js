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
    }
};
const statement = 'create table author (id number, name string, age number, city string, state string, country string)';
database.execute(statement);
console.log(JSON.stringify(database, undefined, ' '));
