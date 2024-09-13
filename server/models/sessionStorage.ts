import Model from "./model";
import User from "./user";

export default class SessionStorage extends Model {
    tableName: string = 'session_storage';
    constructor(
        public create_time: Date,
        public name: string,
        public token: string,
        public user?: User
    ) {
        super();
     }

    // foriegn keys
    get user_id(): number {
        return this.user?.id ?? this.user_id;
    } set user_id(value: number) {
        this.user_id = value;
    }
}