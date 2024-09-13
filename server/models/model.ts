export interface IModel {
    id: number;
    tableName: string;
}
export default class Model implements IModel {
    constructor() { }
    id!: number;
    tableName!: string;
}