import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createTableQueue1613958114414 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "queue",
            columns: [{
                name: "id",
                type: 'varchar',
                isPrimary: true,
                generationStrategy: "uuid",
            },{
                name: "name",
                type: "varchar"
            },{
                name: "subject",
                type: "varchar"
            },{
                name: "avatar_url",
                type: "varchar",
                isNullable: true
            },{
                name: "client_id",
                type: "varchar"
            },{
                name: "status",
                type: "enum",
                enum: ["open", "close", "progress"],
                default: "'open'"
            },{
                name: "protocol",
                type: "varchar",
            },{
                name: "attendant",
                type: "int",
                isNullable: true
            },{
                name: "number",
                type: "varchar",
                isUnique: true
            },{
                name: "created_at",
                type: "datetime",
                default: "CURRENT_TIMESTAMP()"
            },{
                name: "updated_at",
                type: "datetime",
                default: "CURRENT_TIMESTAMP()",
                onUpdate: "CURRENT_TIMESTAMP()"
            }]
        }), true)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('queue')
    }

}
