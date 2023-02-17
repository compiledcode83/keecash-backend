import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBeneficiaryWalletTable1676625008122 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'beneficiary_wallet',
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
            name: 'address',
            type: 'varchar',
            length: '256',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '256',
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['BTC', 'LNBC', 'ETH_ERC20', 'USDT_ERC20', 'USDT_TRC20', 'USDC_ERC20'],
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
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
