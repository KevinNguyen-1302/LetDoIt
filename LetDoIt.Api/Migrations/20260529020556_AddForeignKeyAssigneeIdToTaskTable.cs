using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LetDoIt.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddForeignKeyAssigneeIdToTaskTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Tasks_assignee_id",
                table: "Tasks",
                column: "assignee_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Users_assignee_id",
                table: "Tasks",
                column: "assignee_id",
                principalTable: "Users",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Users_assignee_id",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_assignee_id",
                table: "Tasks");
        }
    }
}
