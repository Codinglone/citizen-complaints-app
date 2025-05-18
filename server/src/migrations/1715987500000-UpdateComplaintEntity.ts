import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateComplaintEntity1715987500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "complaint" ADD COLUMN IF NOT EXISTS "location" character varying`);
    await queryRunner.query(`ALTER TABLE "complaint" ADD COLUMN IF NOT EXISTS "priority" character varying DEFAULT 'medium'`);
    await queryRunner.query(`ALTER TABLE "complaint" ADD COLUMN IF NOT EXISTS "trackingCode" character varying`);
    await queryRunner.query(`ALTER TABLE "complaint" ADD COLUMN IF NOT EXISTS "contactEmail" character varying`);
    await queryRunner.query(`ALTER TABLE "complaint" ADD COLUMN IF NOT EXISTS "contactPhone" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "complaint" DROP COLUMN IF EXISTS "location"`);
    await queryRunner.query(`ALTER TABLE "complaint" DROP COLUMN IF EXISTS "priority"`);
    await queryRunner.query(`ALTER TABLE "complaint" DROP COLUMN IF EXISTS "trackingCode"`);
    await queryRunner.query(`ALTER TABLE "complaint" DROP COLUMN IF EXISTS "contactEmail"`);
    await queryRunner.query(`ALTER TABLE "complaint" DROP COLUMN IF EXISTS "contactPhone"`);
  }
}