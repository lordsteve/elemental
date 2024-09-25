import { SessionStorage } from 'models';
import DatabaseService from './database/service';
import { QueryBuilder } from './database';
export default class Security {
    public static generateCSRFToken = () => {
        return Array.from({ length: 32 }, () => Math.floor(Math.random() * 256).toString(16)).join('');
    };

    public static getCSRFToken = () => {
        const token = this.generateCSRFToken();
        DatabaseService.insert<SessionStorage>([{
            token: token,
            name: 'test',
            create_time: new Date(),
            tableName: 'session_storage',
            user_id: 0,
            id: 0
        }]);
        return token;
    };

    public static validateCSRFToken = (token: string) => {
        DatabaseService.query = `
            SELECT token FROM session_storage WHERE token = '${token}' AND create_time > NOW() - INTERVAL 1 HOUR
        `;
        return QueryBuilder.execute()
            .then( query => query.length > 0);
    };
}