import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createTableDialog1613505180803 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "dialog",
            columns:[
                {
                    name: "id",
                    type: 'varchar',
                    isPrimary: true,
                    generationStrategy: "uuid",
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "64"
                },
                {
                    name: "number",
                    type: "varchar"
                },
                {
                    name: "stage",
                    type: "int",
                    length: "2"
                },
                {
                    name: "client_cpf",
                    type: "varchar",
                    length: "20"
                },
                {
                    name: "created_at",
                    type: "datetime",
                    default: "CURRENT_TIMESTAMP()"
                },
                {
                    name: "updated_at",
                    type: "datetime",
                    default: "CURRENT_TIMESTAMP()",
                    onUpdate: "CURRENT_TIMESTAMP()"
                }
            ]
        }), true)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("dialog");
    }

}
