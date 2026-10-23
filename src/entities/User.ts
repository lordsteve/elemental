/**
 * The logged-in user as the front end sees it. The server's User entity
 * has more; routes.base.ts strips the private fields before storing this.
 */
export default class User {

    id!: number

    public username!: string

    public profilePicture!: string

    public isAdmin!: boolean

    public firstName?: string

    public lastName?: string

    public email?: string

    public discord_id?: string

}
