import { useMemo, useState } from "react";
import StatCard from "./StatCard";
import StudentModal from "./StudentModal";

function DashboardPage({
  students,
  summary,
  loading,
  studentSubmitLoading,
  deletingStudentId,
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
          <button
            type="button"
            className="primary-btn"
            onClick={onAddStudent}
            disabled={studentSubmitLoading || Boolean(deletingStudentId)}
          >
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
                  <td data-label="Full Name">{student.fullName}</td>
                  <td data-label="Email">{student.email}</td>
                  <td data-label="Course">{student.courseName}</td>
                  <td data-label="Batch Timing">{student.batchTiming}</td>
                  <td className="actions" data-label="Actions">
                    <button
                      type="button"
                      className="ghost-btn compact-btn"
                      disabled={studentSubmitLoading || Boolean(deletingStudentId)}
                      onClick={() => onOpenStudent(student)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-btn compact-btn"
                      disabled={studentSubmitLoading || deletingStudentId === student._id}
                      onClick={() => onStudentDelete(student._id)}
                    >
                      {deletingStudentId === student._id ? (
                        <>
                          <span className="spinner tiny" aria-hidden="true" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
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
        studentSubmitLoading={studentSubmitLoading}
        deletingStudentId={deletingStudentId}
      />
    </>
  );
}

export default DashboardPage;
