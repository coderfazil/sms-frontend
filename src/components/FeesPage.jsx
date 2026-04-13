function FeesPage({ students, feeForm, setFeeForm, feePayments, onSubmit }) {
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
          onChange={(event) => setFeeForm({ ...feeForm, feeAmount: event.target.value })}
          required
        />
        <input
          type="date"
          value={feeForm.paymentDate}
          onChange={(event) =>
            setFeeForm({ ...feeForm, paymentDate: event.target.value })
          }
          required
        />
        <select
          value={feeForm.paymentStatus}
          onChange={(event) =>
            setFeeForm({ ...feeForm, paymentStatus: event.target.value })
          }
          required
        >
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Pending">Pending</option>
        </select>
        <button type="submit" className="primary-btn">
          Save Payment
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
                <td>{payment.student?.fullName || "Student"}</td>
                <td>Rs {payment.feeAmount}</td>
                <td>{payment.paymentDate}</td>
                <td>
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
