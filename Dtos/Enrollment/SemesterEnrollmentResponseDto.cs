namespace InscripcionApi.Dtos.Enrollment
{
    public class SemesterEnrollmentResponseDto
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public string SemesterName { get; set; } = string.Empty;
        public DateTime EnrollmentDate { get; set; }
        public int MaxCreditHours { get; set; }
        public int CurrentCreditHours { get; set; }
        public ICollection<EnrolledCourseResponseDto> EnrolledCourses { get; set; } = new List<EnrolledCourseResponseDto>();
    }
}