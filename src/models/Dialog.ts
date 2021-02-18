import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn  } from "typeorm"

@Entity()
export default class Dialog
{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    name: string;

    @Column()
    number: string;

    @Column({ default: 0 })
    stage: number;

    @Column({ default: null })
    cliente_cpf: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date
}