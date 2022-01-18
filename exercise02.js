const statement = 'create table author (id number, name string, age number, city string, state string, country string)';
const regexp = /create table ([\w]+) \(([\w ]+[, \w]*)\)/;
const result = regexp.exec(statement);
const tableName = result[1];
const columnsList = result[2];
const columns = columnsList.split(',');
const database = {
    tables: {
        [tableName]: {
            columns: {},
            data: []
        }
    }
};
for (let column of columns) {
    column = column.trim().split(' ');
    const name = column[0];
    const type = column[1];database.tables[tableName].columns[name] = type;
}
console.log(JSON.stringify(database, undefined, ' '));
