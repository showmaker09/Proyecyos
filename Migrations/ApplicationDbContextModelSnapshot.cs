﻿// <auto-generated />
using System;
using InscripcionApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Inscripcion.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("InscripcionApi.Models.Course", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CreditHours")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(150)
                        .HasColumnType("varchar(150)");

                    b.HasKey("Id");

                    b.ToTable("Courses");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            CreditHours = 4,
                            Name = "Programación Orientada a Objetos"
                        },
                        new
                        {
                            Id = 2,
                            CreditHours = 3,
                            Name = "Bases de Datos Relacionales"
                        },
                        new
                        {
                            Id = 3,
                            CreditHours = 5,
                            Name = "Cálculo Diferencial"
                        },
                        new
                        {
                            Id = 4,
                            CreditHours = 3,
                            Name = "Redes de Computadoras"
                        });
                });

            modelBuilder.Entity("InscripcionApi.Models.EnrolledCourse", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("CourseName")
                        .IsRequired()
                        .HasMaxLength(150)
                        .HasColumnType("varchar(150)");

                    b.Property<int>("CreditHours")
                        .HasColumnType("int");

                    b.Property<int>("SemesterEnrollmentId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("SemesterEnrollmentId");

                    b.ToTable("EnrolledCourses");
                });

            modelBuilder.Entity("InscripcionApi.Models.SemesterEnrollment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CurrentCreditHours")
                        .HasColumnType("int");

                    b.Property<DateTime>("EnrollmentDate")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("MaxCreditHours")
                        .HasColumnType("int");

                    b.Property<string>("SemesterName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<int>("StudentId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("StudentId");

                    b.ToTable("SemesterEnrollments");
                });

            modelBuilder.Entity("InscripcionApi.Models.Student", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(150)
                        .HasColumnType("varchar(150)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<byte[]>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("longblob");

                    b.Property<byte[]>("PasswordSalt")
                        .IsRequired()
                        .HasColumnType("longblob");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.HasKey("Id");

                    b.ToTable("Students");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Email = "estudiante@universidad.com",
                            FirstName = "Estudiante",
                            LastName = "Demo",
                            PasswordHash = new byte[] { 36, 50, 97, 36, 49, 49, 36, 76, 67, 65, 83, 86, 88, 69, 57, 72, 49, 84, 49, 66, 69, 75, 121, 116, 89, 47, 107, 122, 46, 117, 54, 65, 76, 47, 122, 88, 102, 99, 115, 108, 90, 85, 77, 52, 114, 100, 117, 106, 69, 111, 98, 111, 55, 90, 101, 76, 55, 112, 112, 54 },
                            PasswordSalt = new byte[] { 36, 50, 97, 36, 49, 49, 36, 54, 57, 88, 116, 77, 70, 77, 67, 70, 122, 100, 117, 69, 88, 54, 113, 111, 84, 99, 115, 103, 79 },
                            Role = "Estudiante"
                        });
                });

            modelBuilder.Entity("InscripcionApi.Models.EnrolledCourse", b =>
                {
                    b.HasOne("InscripcionApi.Models.SemesterEnrollment", "SemesterEnrollment")
                        .WithMany("EnrolledCourses")
                        .HasForeignKey("SemesterEnrollmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("SemesterEnrollment");
                });

            modelBuilder.Entity("InscripcionApi.Models.SemesterEnrollment", b =>
                {
                    b.HasOne("InscripcionApi.Models.Student", "Student")
                        .WithMany("SemesterEnrollments")
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Student");
                });

            modelBuilder.Entity("InscripcionApi.Models.SemesterEnrollment", b =>
                {
                    b.Navigation("EnrolledCourses");
                });

            modelBuilder.Entity("InscripcionApi.Models.Student", b =>
                {
                    b.Navigation("SemesterEnrollments");
                });
#pragma warning restore 612, 618
        }
    }
}
