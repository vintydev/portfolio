using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VintyDev.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddContactMessagestatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ErrorMessage",
                table: "ContactMessages",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "ContactMessages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ErrorMessage",
                table: "ContactMessages");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "ContactMessages");
        }
    }
}
