using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LetDoIt.Api.Migrations
{
    /// <inheritdoc />
    public partial class ConfigModelSession : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sessions_Tasks_TaskId",
                table: "Sessions");

            migrationBuilder.AlterColumn<Guid>(
                name: "TaskId",
                table: "Sessions",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            // Drop the IDENTITY constraint, create temp column, migrate data, and switch
            migrationBuilder.Sql("ALTER TABLE \"Sessions\" ALTER COLUMN \"SessionId\" DROP IDENTITY;");
            
            // Create a temporary UUID column
            migrationBuilder.Sql("ALTER TABLE \"Sessions\" ADD COLUMN \"SessionId_new\" uuid;");
            
            // Generate UUIDs for existing rows using MD5 hash of the old integer ID
            migrationBuilder.Sql("UPDATE \"Sessions\" SET \"SessionId_new\" = md5('session_' || \"SessionId\")::uuid;");
            
            // Drop the old SessionId column and rename the new one
            migrationBuilder.Sql("ALTER TABLE \"Sessions\" DROP COLUMN \"SessionId\";");
            migrationBuilder.Sql("ALTER TABLE \"Sessions\" RENAME COLUMN \"SessionId_new\" TO \"SessionId\";");
            
            // Add primary key constraint
            migrationBuilder.Sql("ALTER TABLE \"Sessions\" ADD CONSTRAINT \"PK_Sessions\" PRIMARY KEY (\"SessionId\");");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Sessions",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_UserId",
                table: "Sessions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Sessions_Tasks_TaskId",
                table: "Sessions",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "TaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_Sessions_Users_UserId",
                table: "Sessions",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sessions_Tasks_TaskId",
                table: "Sessions");

            migrationBuilder.DropForeignKey(
                name: "FK_Sessions_Users_UserId",
                table: "Sessions");

            migrationBuilder.DropIndex(
                name: "IX_Sessions_UserId",
                table: "Sessions");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Sessions");

            migrationBuilder.AlterColumn<Guid>(
                name: "TaskId",
                table: "Sessions",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.DropPrimaryKey(
                name: "PK_Sessions",
                table: "Sessions");

            migrationBuilder.DropForeignKey(
                name: "FK_Sessions_Tasks_TaskId",
                table: "Sessions");

            migrationBuilder.DropForeignKey(
                name: "FK_Sessions_Users_UserId",
                table: "Sessions");

            migrationBuilder.DropIndex(
                name: "IX_Sessions_UserId",
                table: "Sessions");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Sessions");

            // Create temporary integer column
            migrationBuilder.Sql("ALTER TABLE \"Sessions\" ADD COLUMN \"SessionId_old\" integer;");
            
            // Generate sequential IDs
            migrationBuilder.Sql("ALTER TABLE \"Sessions\" ADD COLUMN rn SERIAL;");
            migrationBuilder.Sql("UPDATE \"Sessions\" SET \"SessionId_old\" = rn;");
            migrationBuilder.Sql("ALTER TABLE \"Sessions\" DROP COLUMN rn;");
            
            // Drop UUID column and rename
            migrationBuilder.Sql("ALTER TABLE \"Sessions\" DROP COLUMN \"SessionId\";");
            migrationBuilder.Sql("ALTER TABLE \"Sessions\" RENAME COLUMN \"SessionId_old\" TO \"SessionId\";");
            
            // Restore identity
            migrationBuilder.Sql("ALTER TABLE \"Sessions\" ALTER COLUMN \"SessionId\" ADD GENERATED BY DEFAULT AS IDENTITY;");

            migrationBuilder.AlterColumn<Guid>(
                name: "TaskId",
                table: "Sessions",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Sessions",
                table: "Sessions",
                column: "SessionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Sessions_Tasks_TaskId",
                table: "Sessions",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "TaskId");


            migrationBuilder.AddForeignKey(
                name: "FK_Sessions_Tasks_TaskId",
                table: "Sessions",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "TaskId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
