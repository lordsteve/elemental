import Model from "./model";

export default class User extends Model {
    public tableName: string = 'users';
    constructor(
        public username: string,
        public password: string,
        public email: string,
        public role: string
    ) {
        super();
     }
}