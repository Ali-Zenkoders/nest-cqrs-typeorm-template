import { MigrationInterface, QueryRunner } from "typeorm";

export class UserDetailTable1753442575320 implements MigrationInterface {
    name = 'UserDetailTable1753442575320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_detail_onboard_status_enum" AS ENUM('wedding_style', 'invitation_guests', 'big_day', 'budget')`);
        await queryRunner.query(`CREATE TYPE "public"."user_detail_wedding_style_enum" AS ENUM('rustic', 'heritage', 'garden')`);
        await queryRunner.query(`CREATE TYPE "public"."user_detail_invitation_guests_enum" AS ENUM('1-50', '50-100', '100-200', '200+')`);
        await queryRunner.query(`CREATE TYPE "public"."user_detail_wedding_budget_enum" AS ENUM('0-15_000', '15_000-30_000', '30_000-60_000', '60_000-100_000', '100_000+')`);
        await queryRunner.query(`CREATE TABLE "user_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "onboard_status" "public"."user_detail_onboard_status_enum" NOT NULL DEFAULT 'wedding_style', "wedding_style" "public"."user_detail_wedding_style_enum", "invitation_guests" "public"."user_detail_invitation_guests_enum", "wedding_date" date, "wedding_location" text, "wedding_budget" "public"."user_detail_wedding_budget_enum", "onboarding_complete" boolean NOT NULL DEFAULT false, "user_id" uuid, CONSTRAINT "REL_aebc3bfe11ea329ed91cd8c575" UNIQUE ("user_id"), CONSTRAINT "PK_673613c95633d9058a44041794d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_detail" ADD CONSTRAINT "FK_aebc3bfe11ea329ed91cd8c5759" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_detail" DROP CONSTRAINT "FK_aebc3bfe11ea329ed91cd8c5759"`);
        await queryRunner.query(`DROP TABLE "user_detail"`);
        await queryRunner.query(`DROP TYPE "public"."user_detail_wedding_budget_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_detail_invitation_guests_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_detail_wedding_style_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_detail_onboard_status_enum"`);
    }

}
