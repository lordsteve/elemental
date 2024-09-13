import mysql from 'mysql';
import Model from '@models/model';

export default class Service {
    static query: string;
    constructor(
        public query: string
    ) { }

    public static get context() {
        return mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
    }

    public static async connect(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.context.connect((err) => {
                if (err) {
                    console.error(err);
                    resolve(false);
                } else {
                    console.log('Connected to database.');
                    resolve(true);
                }
            });
        });
    }

    public static makeSnakeCase(str: string) {
        str = str.replace(/([A-Z])/g, ' $1').trim();
        return str.toLowerCase().replace(/[^a-z0-9]/gi, ' ').replace(' ', '_');
    }

    public static async createTable(tableName: string, columns: {columnName: string, datatype: string}[]) {
        if (tableName !== this.makeSnakeCase(tableName)) {
            tableName = this.makeSnakeCase(tableName);
            console.warn(`Table name must be snake_case. Automatically converted to ${tableName}.`);
        }

        if (!await this.isConnected()) {
            await this.connect();
        }

        const columnsInsert = columns.map(column => {
            if (column.columnName !== this.makeSnakeCase(column.columnName)) {
                column.columnName = this.makeSnakeCase(column.columnName);
                console.warn(`Column name must be snake_case. Automatically converted to ${column.columnName}.`);
            }
            return `${column.columnName} ${column.datatype}`
        });

        this.context.query(`CREATE TABLE IF NOT EXISTS ${tableName} (${columnsInsert.join(',')})`, (err, results) => {
            if (err) {
                console.error(err);
            } else {
                console.log(results);
            }
        });

        this.context.end();
    }

    public static async isConnected() {
        return new Promise((resolve, reject) => {
            this.context.ping((err) => {
                if (err) {
                    console.error(err);
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    public static async tableExists(tableName: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            var closeConnection: boolean = false;
            if (!await this.isConnected()) {
                await this.connect();
                closeConnection = true;
            }
            this.context.query(`SHOW TABLES LIKE '${tableName}'`, (err, results) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(results);
                }
                resolve(results.length > 0);
                if (closeConnection) this.context.end();
            });
        });
    }

    public static async dropTable(tableName: string) {
        if (!await this.tableExists(tableName)) {
            console.warn(`Table ${tableName} does not exist.`);
            return;
        }

        var closeConnection: boolean = false;

        if (!await this.isConnected()) {
            await this.connect();
            closeConnection = true;
        }
        this.context.query(`DROP TABLE IF EXISTS ${tableName}`, (err, results) => {
            if (err) {
                console.error(err);
            } else {
                console.log(results);
            }
            if (closeConnection) this.context.end();
        });
    }

    public static async insert<T extends Model>(rows: T[]) {
        return new Promise(async (resolve, reject) => {
            if (!await this.tableExists(rows[0].tableName)) {
                console.warn(`Table ${rows[0].tableName} does not exist.`);
                return;
            }

            let insertion: string[] = [];
            let columnsArray: string[] = [];
            let columnsInsert: string = '';
            let valuesInsert: string[] = [];
            for (let i = 0; i < rows.length; i++) {
                if (i === 0) {
                    const columns = Object.keys(rows[i]);
                    for (let i = 0; i < columns.length; i++) {
                        if (columns[i] === 'tableName' || columns[i] === 'id') continue;
                        if (columns[i] !== this.makeSnakeCase(columns[i])) {
                            columns[i] = this.makeSnakeCase(columns[i]);
                            console.warn(`Column name must be snake_case. Automatically converted to ${columns[i]}.`);
                        }
                        columnsArray.push(columns[i]);
                    }
                    columnsInsert = `(${columnsArray.join(',')})`;
                }

                const values = Object.values(rows[i]);
                for (let i = 0; i < values.length; i++) {
                    if (i >= columnsArray.length) return;
                    if (typeof values[i] === 'boolean') {
                        valuesInsert.push(values[i] ? '1' : '0');
                    } else if (typeof values[i] !== 'object') {
                        valuesInsert.push(`'${values[i]}'`);
                    } else if (values[i] instanceof Date) {
                        valuesInsert.push(`'${(values[i] as Date).toISOString().slice(0, 19).replace('T', ' ')}'`);
                    } else {
                        valuesInsert.push(`'${JSON.stringify(values[i])}'`);
                    }
                }

                insertion.push(`(${valuesInsert.join(',')})`);
            }

            var closeConnection = false;
            if (!await this.isConnected()) {
                await this.connect();
                closeConnection = true;
            }
            this.context.query(`INSERT INTO ${rows[0].tableName} ${columnsInsert} ${insertion.join(',')}`, (err, results) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(results);
                    resolve(results);
                }

                if (closeConnection) this.context.end();
            });
        });
    }
}