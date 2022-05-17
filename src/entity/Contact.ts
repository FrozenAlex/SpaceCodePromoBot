import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"



@Entity()
export class Contact {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true, length:70})
    telegramId: string

    @Column({nullable: true, length:255})
    firstName: string

    @Column({nullable: true, length:255})
    lastName?: string

    @Column({nullable: true, length:255})
    username?: string

    @Column({nullable: true, length:30})
    phone?: string

    @Column({nullable: true, length:10})
    language_code?: string

    @Column({nullable: true})
    is_bot?: boolean
}