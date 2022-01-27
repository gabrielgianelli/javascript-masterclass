import Parser from './parser.mjs';
import DatabaseError from './database-error.mjs';

export default class Database {
    constructor () {
        this.tables = {};
        this.parser = new Parser();
    }

    createTable(parsedStatement) {
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
    }

    insert(parsedStatement) {
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
    }

    select(parsedStatement) {
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
    }

    delete(parsedStatement) {
        const [, tableName, filter] = parsedStatement;
        let rows = this.tables[tableName].data;
        if (!filter) rows = [];
        else {
            const parsedFilter = filter.split(' = ');
            const [filterColumn, filterValue] = parsedFilter;
            rows = rows.filter(row => row[filterColumn] !== filterValue);
        }
        this.tables[tableName].data = rows;
    }

    execute(statement) {
        const { command, parsedStatement } = this.parser.parse(statement);
        if (!command) throw new DatabaseError(statement, 'Syntax error');
        return this[command](parsedStatement);
    }
};
