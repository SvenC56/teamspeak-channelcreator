import {MigrationInterface, QueryRunner} from "typeorm";

export class firstMigration1599376497134 implements MigrationInterface {
    name = 'firstMigration1599376497134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "assignment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "shield" boolean NOT NULL, "tsid" integer NOT NULL, "dcid" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "UQ_ca46f5aefa97a7f3322b347be3d" UNIQUE ("name"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "assignment"`);
    }

}
