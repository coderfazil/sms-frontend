function ClassesPage({
  classForm,
  classSubmitLoading,
  setClassForm,
  classEntries,
  onSubmit
}) {
  return (
    <section className="panel page-panel">
      <div className="page-header">
        <div>
          <p className="section-tag">Classes</p>
          <h2>Class Tracking</h2>
          <span>Add a conducted class entry and view the class list.</span>
        </div>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        <input
          placeholder="Class Topic / Subject"
          value={classForm.topic}
          disabled={classSubmitLoading}
          onChange={(event) => setClassForm({ ...classForm, topic: event.target.value })}
          required
        />
        <div className="field-group">
          <label className="field-label" htmlFor="class-date">
            Class Date
          </label>
          <input
            id="class-date"
            className="date-input"
            type="date"
            value={classForm.classDate}
            disabled={classSubmitLoading}
            onChange={(event) =>
              setClassForm({ ...classForm, classDate: event.target.value })
            }
            required
          />
        </div>
        <input
          placeholder="Batch Name"
          value={classForm.batchName}
          disabled={classSubmitLoading}
          onChange={(event) =>
            setClassForm({ ...classForm, batchName: event.target.value })
          }
          required
        />
        <button type="submit" className="primary-btn" disabled={classSubmitLoading}>
          {classSubmitLoading ? (
            <>
              <span className="spinner tiny" aria-hidden="true" />
              Saving...
            </>
          ) : (
            "Add Class"
          )}
        </button>
      </form>

      <div className="list-grid">
        {classEntries.map((entry) => (
          <article className="list-card" key={entry._id}>
            <div>
              <h3>{entry.topic}</h3>
              <p>{entry.classDate}</p>
            </div>
            <span className="status-pill info">{entry.batchName}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ClassesPage;
