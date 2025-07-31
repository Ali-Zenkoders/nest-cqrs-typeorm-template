import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTable1753442450994 implements MigrationInterface {
    name = 'UserTable1753442450994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_provider_enum" AS ENUM('google', 'local')`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'vendor', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'banned')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "google_id" character varying(255), "name" character varying(50) NOT NULL, "email" character varying(255) NOT NULL, "provider" "public"."user_provider_enum" NOT NULL, "role" "public"."user_role_enum" NOT NULL, "password" character varying(255), "is_agreed" boolean NOT NULL, "status" "public"."user_status_enum" NOT NULL DEFAULT 'active', "is_verified" boolean NOT NULL DEFAULT false, "last_login" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_provider_enum"`);
    }

}
