import { MigrationInterface, QueryRunner } from 'typeorm';

export class MainEntities1756327897453 implements MigrationInterface {
  name = 'MainEntities1756327897453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "listId" uuid, CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "boardId" uuid, CONSTRAINT "PK_268b525e9a6dd04d0685cb2aaaa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "boards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_606923b0b068ef262dfdcd18f44" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."board_members_role_enum" AS ENUM('OWNER', 'MEMBER', 'VIEWER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "board_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."board_members_role_enum" NOT NULL DEFAULT 'MEMBER', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "boardId" uuid, CONSTRAINT "PK_6994cea1393b5fa3a0dd827a9f7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user-tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hashedRefreshToken" character varying NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" uuid, CONSTRAINT "PK_9b0d1dd50c256de1298eb52f67c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cards" ADD CONSTRAINT "FK_8e71fba12a609e08cf311fde6d9" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lists" ADD CONSTRAINT "FK_05460f5df61d54daeaf96c54c00" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "boards" ADD CONSTRAINT "FK_dcdf669d9c6727190556702de56" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "board_members" ADD CONSTRAINT "FK_2af5912734e7fbedc23afd07adc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "board_members" ADD CONSTRAINT "FK_8dfe924ec592792320086ebb692" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-tokens" ADD CONSTRAINT "FK_a0940c7c76bf141bfadf063a98e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user-tokens" DROP CONSTRAINT "FK_a0940c7c76bf141bfadf063a98e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "board_members" DROP CONSTRAINT "FK_8dfe924ec592792320086ebb692"`,
    );
    await queryRunner.query(
      `ALTER TABLE "board_members" DROP CONSTRAINT "FK_2af5912734e7fbedc23afd07adc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "boards" DROP CONSTRAINT "FK_dcdf669d9c6727190556702de56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lists" DROP CONSTRAINT "FK_05460f5df61d54daeaf96c54c00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cards" DROP CONSTRAINT "FK_8e71fba12a609e08cf311fde6d9"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "user-tokens"`);
    await queryRunner.query(`DROP TABLE "board_members"`);
    await queryRunner.query(`DROP TYPE "public"."board_members_role_enum"`);
    await queryRunner.query(`DROP TABLE "boards"`);
    await queryRunner.query(`DROP TABLE "lists"`);
    await queryRunner.query(`DROP TABLE "cards"`);
  }
}
