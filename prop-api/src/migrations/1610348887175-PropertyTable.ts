import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class PropertyTable1610348887175 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'property',
              columns: [
                {
                  name: 'id',
                  type: 'int4',
                  isPrimary: true,
                  isGenerated: true,
                  generationStrategy: 'increment',
                },
                {
                  name: 'email',
                  type: 'varchar',
                  isNullable: false,
                },
                {
                  name: 'formatted_address',
                  type: 'varchar',
                  isNullable: false,
                },
                {
                  name: 'house_No',
                  type: 'varchar',
                  isNullable: false,
                },
              ],
            }),
            false,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
