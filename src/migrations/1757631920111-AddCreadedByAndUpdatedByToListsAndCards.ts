import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreadedByAndUpdatedByToListsAndCards1757631920111
  implements MigrationInterface
{
  name = 'AddCreadedByAndUpdatedByToListsAndCards1757631920111';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cards" ADD "createdById" uuid`);
    await queryRunner.query(`ALTER TABLE "cards" ADD "updatedById" uuid`);
    await queryRunner.query(`ALTER TABLE "lists" ADD "createdById" uuid`);
    await queryRunner.query(`ALTER TABLE "lists" ADD "updatedById" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user-tokens" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-tokens" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "cards" ADD CONSTRAINT "FK_f6c4a23229e3fa778273eb89502" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cards" ADD CONSTRAINT "FK_9242f6ab989a4b42a63f64fac76" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lists" ADD CONSTRAINT "FK_f53a707360f3434db2c6b797cc9" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lists" ADD CONSTRAINT "FK_c7f340a5cb8023d03e97b3e75f1" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lists" DROP CONSTRAINT "FK_c7f340a5cb8023d03e97b3e75f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lists" DROP CONSTRAINT "FK_f53a707360f3434db2c6b797cc9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cards" DROP CONSTRAINT "FK_9242f6ab989a4b42a63f64fac76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cards" DROP CONSTRAINT "FK_f6c4a23229e3fa778273eb89502"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-tokens" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-tokens" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(`ALTER TABLE "lists" DROP COLUMN "updatedById"`);
    await queryRunner.query(`ALTER TABLE "lists" DROP COLUMN "createdById"`);
    await queryRunner.query(`ALTER TABLE "cards" DROP COLUMN "updatedById"`);
    await queryRunner.query(`ALTER TABLE "cards" DROP COLUMN "createdById"`);
  }
}
