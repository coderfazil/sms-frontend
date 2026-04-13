import { useMemo, useState } from "react";

function AttendancePage({
  students,
  attendanceForm,
  attendanceError,
  attendanceSubmitLoading,
  setAttendanceForm,
  attendanceRecords,
  onSubmit
}) {
  const [historyStudentId, setHistoryStudentId] = useState("");

  const filteredAttendanceHistory = useMemo(() => {
    if (!historyStudentId) {
      return attendanceRecords;
    }

    return attendanceRecords.filter(
      (record) => record.student?._id === historyStudentId
    );
  }, [attendanceRecords, historyStudentId]);

  return (
    <section className="panel page-panel">
      <div className="page-header">
        <div>
          <p className="section-tag">Attendance</p>
          <h2>Attendance Tracking</h2>
          <span>Mark student attendance and review the history list.</span>
        </div>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        <select
          value={attendanceForm.student}
          disabled={attendanceSubmitLoading}
          onChange={(event) =>
            setAttendanceForm({ ...attendanceForm, student: event.target.value })
          }
          required
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.fullName}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={attendanceForm.attendanceDate}
          disabled={attendanceSubmitLoading}
          onChange={(event) =>
            setAttendanceForm({
              ...attendanceForm,
              attendanceDate: event.target.value
            })
          }
          required
        />
        <select
          value={attendanceForm.status}
          disabled={attendanceSubmitLoading}
          onChange={(event) =>
            setAttendanceForm({ ...attendanceForm, status: event.target.value })
          }
          required
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <button type="submit" className="primary-btn" disabled={attendanceSubmitLoading}>
          {attendanceSubmitLoading ? (
            <>
              <span className="spinner tiny" aria-hidden="true" />
              Saving...
            </>
          ) : (
            "Save Attendance"
          )}
        </button>
      </form>

      {attendanceError ? <p className="form-error-banner">{attendanceError}</p> : null}

      <div className="history-toolbar">
        <div>
          <h3 className="subsection-title">Attendance History Per Student</h3>
          <p className="subsection-copy">
            Choose a student to view their attendance history.
          </p>
        </div>
        <select
          value={historyStudentId}
          onChange={(event) => setHistoryStudentId(event.target.value)}
        >
          <option value="">All Students</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.fullName}
            </option>
          ))}
        </select>
      </div>

      <div className="list-grid">
        {filteredAttendanceHistory.map((record) => (
          <article className="list-card" key={record._id}>
            <div>
              <h3>{record.student?.fullName || "Student"}</h3>
              <p>{record.attendanceDate}</p>
            </div>
            <span
              className={
                record.status === "Present" ? "status-pill success" : "status-pill muted"
              }
            >
              {record.status}
            </span>
          </article>
        ))}

        {!filteredAttendanceHistory.length ? (
          <p className="empty-state">No attendance history found for this student.</p>
        ) : null}
      </div>
    </section>
  );
}

export default AttendancePage;
