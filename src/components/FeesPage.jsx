function FeesPage({
  students,
  feeForm,
  feeSubmitLoading,
  setFeeForm,
  feePayments,
  onSubmit
}) {
  return (
    <section className="panel page-panel">
      <div className="page-header">
        <div>
          <p className="section-tag">Fees</p>
          <h2>Fee Management</h2>
          <span>Record a payment and review each student payment status.</span>
        </div>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        <select
          value={feeForm.student}
          disabled={feeSubmitLoading}
          onChange={(event) => setFeeForm({ ...feeForm, student: event.target.value })}
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
          type="number"
          min="0"
          placeholder="Fee Amount"
          value={feeForm.feeAmount}
          disabled={feeSubmitLoading}
          onChange={(event) => setFeeForm({ ...feeForm, feeAmount: event.target.value })}
          required
        />
        <div className="field-group">
          <input
            id="payment-date"
            className="date-input"
            type={feeForm.paymentDate ? "date" : "text"}
            placeholder="Payment Date"
            value={feeForm.paymentDate}
            disabled={feeSubmitLoading}
            onFocus={(event) => {
              event.target.type = "date";
            }}
            onBlur={(event) => {
              if (!event.target.value) {
                event.target.type = "text";
              }
            }}
            onChange={(event) =>
              setFeeForm({ ...feeForm, paymentDate: event.target.value })
            }
            required
          />
        </div>
        <select
          value={feeForm.paymentStatus}
          disabled={feeSubmitLoading}
          onChange={(event) =>
            setFeeForm({ ...feeForm, paymentStatus: event.target.value })
          }
          required
        >
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Pending">Pending</option>
        </select>
        <button type="submit" className="primary-btn" disabled={feeSubmitLoading}>
          {feeSubmitLoading ? (
            <>
              <span className="spinner tiny" aria-hidden="true" />
              Saving...
            </>
          ) : (
            "Save Payment"
          )}
        </button>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {feePayments.map((payment) => (
              <tr key={payment._id}>
                <td data-label="Student">{payment.student?.fullName || "Student"}</td>
                <td data-label="Amount">Rs {payment.feeAmount}</td>
                <td data-label="Date">{payment.paymentDate}</td>
                <td data-label="Status">
                  <span
                    className={`status-pill ${
                      payment.paymentStatus === "Paid"
                        ? "success"
                        : payment.paymentStatus === "Partial"
                          ? "warning"
                          : "muted"
                    }`}
                  >
                    {payment.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default FeesPage;
