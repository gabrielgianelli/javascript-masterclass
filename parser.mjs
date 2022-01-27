export default class Parser {
    constructor () {
        this.commands = new Map();
        this.commands.set('createTable', /create table ([\w]+) \((.+)\)/);
        this.commands.set('insert', /insert into ([\w]+) \((.+)\) values \((.+)\)/);
        this.commands.set('delete', /delete from ([\w]+)(?: where (.+))?/);
        this.commands.set('select', /select (.+) from ([\w]+)(?: where (.+))?/);
    }
    
    parse(statement) {
        for (let [command, regexp] of this.commands) {
            const parsedStatement = statement.match(regexp); 
            if (parsedStatement) {
                return {
                    command,
                    parsedStatement
                }
            }
        }
    }
}
