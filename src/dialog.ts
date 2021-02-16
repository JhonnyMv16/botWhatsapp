import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Dialog {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 36, nullable: false })
    name: string;

    @Column()
    number: string

    @Column()
    cpf: string

    @Column()
    stage: number

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;    
}