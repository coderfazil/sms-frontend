function ClassesPage({ classForm, setClassForm, classEntries, onSubmit }) {
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
          onChange={(event) => setClassForm({ ...classForm, topic: event.target.value })}
          required
        />
        <input
          type="date"
          value={classForm.classDate}
          onChange={(event) =>
            setClassForm({ ...classForm, classDate: event.target.value })
          }
          required
        />
        <input
          placeholder="Batch Name"
          value={classForm.batchName}
          onChange={(event) =>
            setClassForm({ ...classForm, batchName: event.target.value })
          }
          required
        />
        <button type="submit" className="primary-btn">
          Add Class
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
