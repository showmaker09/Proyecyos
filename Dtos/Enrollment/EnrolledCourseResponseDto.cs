namespace InscripcionApi.Dtos.Enrollment
{
    public class EnrolledCourseResponseDto
    {
        public int Id { get; set; }
        public int SemesterEnrollmentId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public int CreditHours { get; set; }
    }
}