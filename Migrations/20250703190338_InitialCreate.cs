using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Inscripcion.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreditHours = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    FirstName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<byte[]>(type: "longblob", nullable: false),
                    PasswordSalt = table.Column<byte[]>(type: "longblob", nullable: false),
                    Role = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SemesterEnrollments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    SemesterName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EnrollmentDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    MaxCreditHours = table.Column<int>(type: "int", nullable: false),
                    CurrentCreditHours = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SemesterEnrollments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SemesterEnrollments_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "EnrolledCourses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SemesterEnrollmentId = table.Column<int>(type: "int", nullable: false),
                    CourseName = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreditHours = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnrolledCourses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EnrolledCourses_SemesterEnrollments_SemesterEnrollmentId",
                        column: x => x.SemesterEnrollmentId,
                        principalTable: "SemesterEnrollments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Courses",
                columns: new[] { "Id", "CreditHours", "Description", "Name" },
                values: new object[,]
                {
                    { 1, 4, null, "Programación Orientada a Objetos" },
                    { 2, 3, null, "Bases de Datos Relacionales" },
                    { 3, 5, null, "Cálculo Diferencial" },
                    { 4, 3, null, "Redes de Computadoras" }
                });

            migrationBuilder.InsertData(
                table: "Students",
                columns: new[] { "Id", "Email", "FirstName", "LastName", "PasswordHash", "PasswordSalt", "Role" },
                values: new object[] { 1, "estudiante@universidad.com", "Estudiante", "Demo", new byte[] { 36, 50, 97, 36, 49, 49, 36, 76, 67, 65, 83, 86, 88, 69, 57, 72, 49, 84, 49, 66, 69, 75, 121, 116, 89, 47, 107, 122, 46, 117, 54, 65, 76, 47, 122, 88, 102, 99, 115, 108, 90, 85, 77, 52, 114, 100, 117, 106, 69, 111, 98, 111, 55, 90, 101, 76, 55, 112, 112, 54 }, new byte[] { 36, 50, 97, 36, 49, 49, 36, 54, 57, 88, 116, 77, 70, 77, 67, 70, 122, 100, 117, 69, 88, 54, 113, 111, 84, 99, 115, 103, 79 }, "Estudiante" });

            migrationBuilder.CreateIndex(
                name: "IX_EnrolledCourses_SemesterEnrollmentId",
                table: "EnrolledCourses",
                column: "SemesterEnrollmentId");

            migrationBuilder.CreateIndex(
                name: "IX_SemesterEnrollments_StudentId",
                table: "SemesterEnrollments",
                column: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "EnrolledCourses");

            migrationBuilder.DropTable(
                name: "SemesterEnrollments");

            migrationBuilder.DropTable(
                name: "Students");
        }
    }
}
