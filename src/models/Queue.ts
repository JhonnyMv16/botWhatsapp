import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn  } from "typeorm"

@Entity()
export default class Queue
{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    name: string;

    @Column({ default: null })
    avatar_url: string

    @Column()
    client_id: string;

    @Column()
    protocol: string;

    @Column()
    subject: string;

    @Column({ default: "open", enum: ["open", "close", "progress"], type: "enum" })
    status: string;

    @Column()
    attendant: number;

    @Column()
    number: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}