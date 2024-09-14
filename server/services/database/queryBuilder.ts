import Service from './service';
import Model from '../../models/model';

export default class QueryBuilder {
    private static buildChain<T extends Model>() {
        return {
            select: this.select<T>,
            where: this.where<T>,
            whereAnd: this.whereAnd<T>,
            whereNot: this.whereNot<T>,
            whereIn: this.whereIn<T>,
            whereNotIn: this.whereNotIn<T>,
            join: this.join,
            execute: this.execute
        };
    }
    private static transformValue(value: any) {
        if (typeof value === 'boolean') {
            value = value ? '1' : '0';
        } else if (typeof value !== 'object') {
            value = String(value);
        } else if (value instanceof Date) {
            value = value.toISOString().slice(0, 19).replace('T', ' ');
        } else {
            value = JSON.stringify(value);
        }
        return value;
    }

    public static select<T extends Model>(...args: (keyof T)[]) {
        const tableName = (new Model() as T).tableName;
        const columns = [];

        for (let i = 0; i < args.length; i++) {
            columns[i] = Service.makeSnakeCase(String(args[i]));
        }

        Service.query = `SELECT ${columns.join(',')} FROM ${tableName}`;
        return this.buildChain<T>();
    }

    public static where<T extends Model>(column: keyof T, value: any) {
        const queryColumn = Service.makeSnakeCase(String(column));
        value = this.transformValue(value);
        Service.query += ` WHERE ${queryColumn} = '${value}'`;
        return this.buildChain<T>();
    }

    public static whereAnd<T extends Model>(args: { column: keyof T, value: any }[]) {
        const columns = args.map(arg => String(arg.column));
        const values = args.map(arg => arg.value);

        for (let i = 0; i < columns.length; i++) {
            values[i] = this.transformValue(values[i]);
        }

        Service.query += ' WHERE ';

        for (let i = 0; i < columns.length; i++) {
            Service.query += `${columns[i]} = '${values[i]}'`;
            if (i < columns.length - 1) {
                Service.query += ' AND ';
            }
        }

        return this.buildChain<T>();
    }

    public static whereNot<T extends Model>(column: keyof T, value: any) {
        const queryColumn = Service.makeSnakeCase(String(column));
        value = this.transformValue(value);
        Service.query += ` WHERE ${queryColumn} != '${value}'`;
        return this.buildChain<T>();
    }

    public static whereIn<T extends Model>(column: keyof T, values: any[]) {
        const queryColumn = Service.makeSnakeCase(String(column));
        for (let i = 0; i < values.length; i++) {
            values[i] = this.transformValue(values[i]);
        }
        Service.query += ` WHERE ${queryColumn} IN (${values.join(',')})`;
        return this.buildChain<T>();
    }

    public static whereNotIn<T extends Model>(column: keyof T, values: any[]) {
        const queryColumn = Service.makeSnakeCase(String(column));
        for (let i = 0; i < values.length; i++) {
            values[i] = this.transformValue(values[i]);
        }
        Service.query += ` WHERE ${queryColumn} NOT IN (${values.join(',')})`;
        return this.buildChain<T>();
    }

    public static join<T extends Model, U extends Model>(identifier?: string) {
        const originalModel = new Model() as T;
        const joinedModel = new Model() as U;
        Service.query += ` JOIN ${originalModel.tableName} ON ${joinedModel.tableName}.${originalModel.tableName}_id = ${joinedModel.tableName}.id`;
        return this.buildChain<T>();
    }

    public static async execute() {
        return new Promise(async (resolve, reject) => {
            var closeConnection = false;
            if (!await Service.isConnected()) {
                await Service.connect();
                closeConnection = true;
            }
            Service.context.query(Service.query, (err, results) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(results);
                    resolve(results);
                }

                if (closeConnection) Service.context.end();
            });
        });
    }
}