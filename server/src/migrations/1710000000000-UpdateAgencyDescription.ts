import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAgencyDescription1710000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First update any NULL descriptions with a default value
        await queryRunner.query(`
            UPDATE "agency" 
            SET "description" = 'No description provided' 
            WHERE "description" IS NULL
        `);

        // Now we can safely add the NOT NULL constraint
        await queryRunner.query(`
            ALTER TABLE "agency" 
            ALTER COLUMN "description" SET NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the NOT NULL constraint
        await queryRunner.query(`
            ALTER TABLE "agency" 
            ALTER COLUMN "description" DROP NOT NULL
        `);
    }
} 