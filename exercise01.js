const statement = 'create table author (id number, name string, age number, city string, state string, country string)';
const regexp = /create table ([\w]+) \(([\w ]+[, \w]*)\)/;
const result = regexp.exec(statement);
const tableName = result[1];
const columnsList = result[2];
const columns = columnsList.split(', ');
console.log(`tableName = "${tableName}"
columns = [${columns.toString()}]`);
