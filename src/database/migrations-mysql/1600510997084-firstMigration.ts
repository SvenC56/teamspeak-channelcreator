import {MigrationInterface, QueryRunner} from "typeorm";

export class firstMigration1600510997084 implements MigrationInterface {
    name = 'firstMigration1600510997084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `assignment` (`id` int NOT NULL AUTO_INCREMENT, `parent` int NOT NULL, `prefix` varchar(255) NOT NULL DEFAULT 'Channel', `min` int NOT NULL DEFAULT 1, `max` int NOT NULL DEFAULT 0, `codec` int ('0', '1', '2', '3', '4', '5') NOT NULL DEFAULT 4, `quality` int NOT NULL DEFAULT 5, `joinPower` int NOT NULL DEFAULT 0, `topic` varchar(255) NOT NULL DEFAULT '', `description` varchar(255) NOT NULL DEFAULT '', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX `IDX_de7639a132e813f2eff91bc1e4` (`parent`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_de7639a132e813f2eff91bc1e4` ON `assignment`");
        await queryRunner.query("DROP TABLE `assignment`");
    }

}
