function StudentModal({
  isOpen,
  student,
  studentForm,
  studentFormErrors,
  studentFormErrorMessage,
  studentSubmitLoading,
  deletingStudentId,
  setStudentForm,
  onClose,
  onSubmit,
  onDelete
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{student ? "Student Details" : "Add New Student"}</h3>
            <p>{student ? "View or update student information." : "Create a student record."}</p>
          </div>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="form-grid" onSubmit={onSubmit}>
          <div className="field-group">
            <input
              className={studentFormErrors.fullName ? "input-error" : ""}
              placeholder="Full Name"
              value={studentForm.fullName}
              disabled={studentSubmitLoading || Boolean(deletingStudentId)}
              onChange={(event) =>
                setStudentForm({ ...studentForm, fullName: event.target.value })
              }
              required
            />
            {studentFormErrors.fullName ? (
              <p className="field-error">{studentFormErrors.fullName}</p>
            ) : null}
          </div>
          <div className="field-group">
            <input
              className={studentFormErrors.email ? "input-error" : ""}
              type="email"
              placeholder="Email"
              value={studentForm.email}
              disabled={studentSubmitLoading || Boolean(deletingStudentId)}
              onChange={(event) =>
                setStudentForm({ ...studentForm, email: event.target.value })
              }
              required
            />
            {studentFormErrors.email ? (
              <p className="field-error">{studentFormErrors.email}</p>
            ) : null}
          </div>
          <div className="field-group">
            <input
              className={studentFormErrors.contactNumber ? "input-error" : ""}
              placeholder="Contact Number"
              value={studentForm.contactNumber}
              disabled={studentSubmitLoading || Boolean(deletingStudentId)}
              onChange={(event) =>
                setStudentForm({ ...studentForm, contactNumber: event.target.value })
              }
              required
            />
            {studentFormErrors.contactNumber ? (
              <p className="field-error">{studentFormErrors.contactNumber}</p>
            ) : null}
          </div>
          <div className="field-group">
            <input
              className={studentFormErrors.courseName ? "input-error" : ""}
              placeholder="Course Name"
              value={studentForm.courseName}
              disabled={studentSubmitLoading || Boolean(deletingStudentId)}
              onChange={(event) =>
                setStudentForm({ ...studentForm, courseName: event.target.value })
              }
              required
            />
            {studentFormErrors.courseName ? (
              <p className="field-error">{studentFormErrors.courseName}</p>
            ) : null}
          </div>
          <div className="field-group">
            <input
              className={studentFormErrors.batchTiming ? "input-error" : ""}
              placeholder="Batch Timing"
              value={studentForm.batchTiming}
              disabled={studentSubmitLoading || Boolean(deletingStudentId)}
              onChange={(event) =>
                setStudentForm({ ...studentForm, batchTiming: event.target.value })
              }
              required
            />
            {studentFormErrors.batchTiming ? (
              <p className="field-error">{studentFormErrors.batchTiming}</p>
            ) : null}
          </div>
          <button
            type="submit"
            className="primary-btn"
            disabled={studentSubmitLoading || Boolean(deletingStudentId)}
          >
            {studentSubmitLoading ? (
              <>
                <span className="spinner tiny" aria-hidden="true" />
                {student ? "Updating..." : "Saving..."}
              </>
            ) : student ? (
              "Update Student"
            ) : (
              "Add Student"
            )}
          </button>
        </form>

        {studentFormErrorMessage ? (
          <p className="form-error-banner">{studentFormErrorMessage}</p>
        ) : null}

        {student ? (
          <div className="modal-footer">
            <button
              type="button"
              className="danger-btn"
              disabled={studentSubmitLoading || deletingStudentId === student._id}
              onClick={() => onDelete(student._id)}
            >
              {deletingStudentId === student._id ? (
                <>
                  <span className="spinner tiny" aria-hidden="true" />
                  Deleting...
                </>
              ) : (
                "Delete Student"
              )}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default StudentModal;
