import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ default: '' })
    public firstName!: string

    @Column({ default: '' })
    public lastName!: string

    @Column({ default: 0 })
    public age!: number

    @Column({ default: '' })
    public username!: string

    @Column({ default: '' })
    public discord_id!: string

    @Column({ default: '' })
    public email!: string

    @Column({ default: '' })
    public profilePicture!: string

    @Column({ default: false })
    public isAdmin!: boolean

}
