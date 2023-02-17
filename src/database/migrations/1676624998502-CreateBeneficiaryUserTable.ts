import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBeneficiaryUserTable1676624998502 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'beneficiary_user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            unsigned: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'beneficiary_user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'datetime',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
          },
          {
            columnNames: ['beneficiary_user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('beneficiary_user');
  }
}
