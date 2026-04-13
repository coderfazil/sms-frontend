import { useMemo, useState } from "react";
import StatCard from "./StatCard";
import StudentModal from "./StudentModal";

function DashboardPage({
  students,
  summary,
  loading,
  selectedStudent,
  isStudentModalOpen,
  studentForm,
  studentFormErrors,
  studentFormErrorMessage,
  setStudentForm,
  onAddStudent,
  onOpenStudent,
  onCloseStudentModal,
  onStudentSubmit,
  onStudentDelete
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return students;
    }

    return students.filter((student) =>
      student.fullName.toLowerCase().includes(normalizedSearch)
    );
  }, [searchTerm, students]);

  return (
    <>
      <section className="stats-grid">
        <StatCard label="Total Students" value={summary.totalStudents} />
        <StatCard label="Attendance Records" value={summary.attendanceCount} />
        <StatCard label="Classes Added" value={summary.classCount} />
        <StatCard label="Fees Collected" value={`Rs ${summary.collectedFees}`} />
      </section>

      <section className="panel page-panel">
        <div className="page-header">
          <div>
            <p className="section-tag">Dashboard</p>
            <h2>Student List</h2>
            <span>Search students, add a record, or open a student modal.</span>
          </div>
          <button type="button" className="primary-btn" onClick={onAddStudent}>
            Add Student
          </button>
        </div>

        <div className="toolbar">
          <input
            className="search-input"
            type="text"
            placeholder="Search by student name"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Batch Timing</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>{student.courseName}</td>
                  <td>{student.batchTiming}</td>
                  <td className="actions">
                    <button
                      type="button"
                      className="ghost-btn compact-btn"
                      onClick={() => onOpenStudent(student)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-btn compact-btn"
                      onClick={() => onStudentDelete(student._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filteredStudents.length && !loading ? (
          <p className="empty-state">No students match your search.</p>
        ) : null}
      </section>

      <StudentModal
        isOpen={isStudentModalOpen}
        student={selectedStudent}
        studentForm={studentForm}
        studentFormErrors={studentFormErrors}
        studentFormErrorMessage={studentFormErrorMessage}
        setStudentForm={setStudentForm}
        onClose={onCloseStudentModal}
        onSubmit={onStudentSubmit}
        onDelete={onStudentDelete}
      />
    </>
  );
}

export default DashboardPage;
