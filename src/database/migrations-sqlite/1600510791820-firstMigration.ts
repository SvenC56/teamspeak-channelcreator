import {MigrationInterface, QueryRunner} from "typeorm";

export class firstMigration1600510791820 implements MigrationInterface {
    name = 'firstMigration1600510791820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "assignment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "parent" integer NOT NULL, "prefix" varchar NOT NULL DEFAULT ('Channel'), "min" integer NOT NULL DEFAULT (1), "max" integer NOT NULL DEFAULT (0), "codec" varchar CHECK( codec IN ('0','1','2','3','4','5') ) NOT NULL DEFAULT (4), "quality" integer NOT NULL DEFAULT (5), "joinPower" integer NOT NULL DEFAULT (0), "topic" varchar NOT NULL DEFAULT (''), "description" varchar NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "UQ_de7639a132e813f2eff91bc1e49" UNIQUE ("parent"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "assignment"`);
    }

}
