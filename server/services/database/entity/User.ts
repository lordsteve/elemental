import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    public firstName!: string

    @Column()
    public lastName!: string

    @Column()
    public age!: number

}
