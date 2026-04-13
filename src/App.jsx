import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import DashboardPage from "./components/DashboardPage";
import AttendancePage from "./components/AttendancePage";
import ClassesPage from "./components/ClassesPage";
import FeesPage from "./components/FeesPage";

const API_BASE_URL = "https://sms-backend-xuio.onrender.com";

const emptyStudentForm = {
  fullName: "",
  email: "",
  contactNumber: "",
  courseName: "",
  batchTiming: ""
};

const emptyAttendanceForm = {
  student: "",
  attendanceDate: "",
  status: "Present"
};

const emptyClassForm = {
  topic: "",
  classDate: "",
  batchName: ""
};

const emptyFeeForm = {
  student: "",
  feeAmount: "",
  paymentDate: "",
  paymentStatus: "Paid"
};

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [classEntries, setClassEntries] = useState([]);
  const [feePayments, setFeePayments] = useState([]);
  const [studentForm, setStudentForm] = useState(emptyStudentForm);
  const [attendanceForm, setAttendanceForm] = useState(emptyAttendanceForm);
  const [classForm, setClassForm] = useState(emptyClassForm);
  const [feeForm, setFeeForm] = useState(emptyFeeForm);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentFormErrors, setStudentFormErrors] = useState({});
  const [studentFormErrorMessage, setStudentFormErrorMessage] = useState("");
  const [attendanceError, setAttendanceError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentsRes, attendanceRes, classesRes, feesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/students`),
        fetch(`${API_BASE_URL}/api/attendance`),
        fetch(`${API_BASE_URL}/api/classes`),
        fetch(`${API_BASE_URL}/api/fees`)
      ]);

      const [studentsData, attendanceData, classesData, feesData] = await Promise.all([
        studentsRes.json(),
        attendanceRes.json(),
        classesRes.json(),
        feesRes.json()
      ]);

      setStudents(studentsData);
      setAttendanceRecords(attendanceData);
      setClassEntries(classesData);
      setFeePayments(feesData);
    } catch (fetchError) {
      setError("Unable to connect to the server. Start backend and MongoDB first.");
    } finally {
      setLoading(false);
    }
  };

  const openAddStudentModal = () => {
    setStudentForm(emptyStudentForm);
    setSelectedStudent(null);
    setStudentFormErrors({});
    setStudentFormErrorMessage("");
    setIsStudentModalOpen(true);
  };

  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setStudentForm({
      fullName: student.fullName,
      email: student.email,
      contactNumber: student.contactNumber,
      courseName: student.courseName,
      batchTiming: student.batchTiming
    });
    setStudentFormErrors({});
    setStudentFormErrorMessage("");
    setIsStudentModalOpen(true);
  };

  const closeStudentModal = () => {
    setSelectedStudent(null);
    setStudentForm(emptyStudentForm);
    setStudentFormErrors({});
    setStudentFormErrorMessage("");
    setIsStudentModalOpen(false);
  };

  const validateStudentForm = () => {
    const errors = {};
    const namePattern = /^[A-Za-z ]{3,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[6-9]\d{9}$/;

    if (!namePattern.test(studentForm.fullName.trim())) {
      errors.fullName = "Enter a valid name with at least 3 letters.";
    }

    if (!emailPattern.test(studentForm.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (!phonePattern.test(studentForm.contactNumber.trim())) {
      errors.contactNumber = "Enter a valid 10-digit mobile number.";
    }

    if (studentForm.courseName.trim().length < 2) {
      errors.courseName = "Course name must be at least 2 characters.";
    }

    if (studentForm.batchTiming.trim().length < 2) {
      errors.batchTiming = "Batch timing is required.";
    }

    setStudentFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStudentSubmit = async (event) => {
    event.preventDefault();

    if (!validateStudentForm()) {
      setStudentFormErrorMessage("Please correct the highlighted student details.");
      return;
    }

    const endpoint = selectedStudent
      ? `${API_BASE_URL}/students/${selectedStudent._id}`
      : `${API_BASE_URL}/students`;

    const method = selectedStudent ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentForm)
    });

    const data = await response.json();

    if (!response.ok) {
      setStudentFormErrorMessage(data.message || "Unable to save student details.");
      return;
    }

    closeStudentModal();
    await loadDashboardData();
  };

  const handleStudentDelete = async (studentId) => {
    await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: "DELETE"
    });

    if (selectedStudent?._id === studentId) {
      closeStudentModal();
    }

    await loadDashboardData();
  };

  const handleAttendanceSubmit = async (event) => {
    event.preventDefault();

    setAttendanceError("");

    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attendanceForm)
    });

    const data = await response.json();

    if (!response.ok) {
      setAttendanceError(data.message || "Unable to save attendance.");
      return;
    }

    setAttendanceForm(emptyAttendanceForm);
    await loadDashboardData();
  };

  const handleClassSubmit = async (event) => {
    event.preventDefault();

    await fetch(`${API_BASE_URL}/classes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(classForm)
    });

    setClassForm(emptyClassForm);
    await loadDashboardData();
  };

  const handleFeeSubmit = async (event) => {
    event.preventDefault();

    await fetch(`${API_BASE_URL}/fees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...feeForm,
        feeAmount: Number(feeForm.feeAmount)
      })
    });

    setFeeForm(emptyFeeForm);
    await loadDashboardData();
  };
  const summary = {
    totalStudents: students.length,
    attendanceCount: attendanceRecords.length,
    classCount: classEntries.length,
    collectedFees: feePayments
      .filter((item) => item.paymentStatus !== "Pending")
      .reduce((total, item) => total + Number(item.feeAmount || 0), 0)
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <h1>Student Management System</h1>

        </div>
      </header>

      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      {error ? <div className="error-banner">{error}</div> : null}

      {currentPage === "dashboard" ? (
        <DashboardPage
          students={students}
          summary={summary}
          loading={loading}
          selectedStudent={selectedStudent}
          isStudentModalOpen={isStudentModalOpen}
          studentForm={studentForm}
          studentFormErrors={studentFormErrors}
          studentFormErrorMessage={studentFormErrorMessage}
          setStudentForm={setStudentForm}
          onAddStudent={openAddStudentModal}
          onOpenStudent={openStudentModal}
          onCloseStudentModal={closeStudentModal}
          onStudentSubmit={handleStudentSubmit}
          onStudentDelete={handleStudentDelete}
        />
      ) : null}

      {currentPage === "attendance" ? (
        <AttendancePage
          students={students}
          attendanceForm={attendanceForm}
          attendanceError={attendanceError}
          setAttendanceForm={setAttendanceForm}
          attendanceRecords={attendanceRecords}
          onSubmit={handleAttendanceSubmit}
        />
      ) : null}

      {currentPage === "classes" ? (
        <ClassesPage
          classForm={classForm}
          setClassForm={setClassForm}
          classEntries={classEntries}
          onSubmit={handleClassSubmit}
        />
      ) : null}

      {currentPage === "fees" ? (
        <FeesPage
          students={students}
          feeForm={feeForm}
          setFeeForm={setFeeForm}
          feePayments={feePayments}
          onSubmit={handleFeeSubmit}
        />
      ) : null}
    </div>
  );
}

export default App;
