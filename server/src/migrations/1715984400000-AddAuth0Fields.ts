import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuth0Fields1715984400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "auth0Id" character varying`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phoneNumber" SET DEFAULT ''`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "auth0Id"`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phoneNumber" DROP DEFAULT`);
  }
}