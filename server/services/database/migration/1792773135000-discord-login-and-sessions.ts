import { MigrationInterface, QueryRunner } from "typeorm";

export class DiscordLoginAndSessions1792773135000 implements MigrationInterface {
    name = 'DiscordLoginAndSessions1792773135000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ALTER \`firstName\` SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`user\` ALTER \`lastName\` SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`user\` ALTER \`age\` SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`username\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`discord_id\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`profilePicture\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`isAdmin\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`CREATE TABLE \`user_session\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tokenHash\` varchar(64) NOT NULL, \`expiresAt\` timestamp NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`IDX_user_session_tokenHash\` (\`tokenHash\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_session\` ADD CONSTRAINT \`FK_user_session_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_session\` DROP FOREIGN KEY \`FK_user_session_user\``);
        await queryRunner.query(`DROP TABLE \`user_session\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`isAdmin\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`profilePicture\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`discord_id\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`username\``);
        await queryRunner.query(`ALTER TABLE \`user\` ALTER \`age\` DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE \`user\` ALTER \`lastName\` DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE \`user\` ALTER \`firstName\` DROP DEFAULT`);
    }

}
