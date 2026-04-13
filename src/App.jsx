import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import DashboardPage from "./components/DashboardPage";
import AttendancePage from "./components/AttendancePage";
import ClassesPage from "./components/ClassesPage";
import FeesPage from "./components/FeesPage";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://sms-backend-xuio.onrender.com"
).replace(/\/$/, "");

const getApiUrl = (path) => `${API_BASE_URL}/api${path}`;

const getErrorMessage = async (response, fallbackMessage) => {
  try {
    const data = await response.json();
    return data.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

const requestJson = async (path, options = {}) => {
  const response = await fetch(getApiUrl(path), options);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Request failed."));
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

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

      const [studentsData, attendanceData, classesData, feesData] = await Promise.all([
        requestJson("/students"),
        requestJson("/attendance"),
        requestJson("/classes"),
        requestJson("/fees")
      ]);

      setStudents(studentsData);
      setAttendanceRecords(attendanceData);
      setClassEntries(classesData);
      setFeePayments(feesData);
    } catch (fetchError) {
      setError(fetchError.message || "Unable to connect to the server.");
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

    try {
      await requestJson(
        selectedStudent ? `/students/${selectedStudent._id}` : "/students",
        {
          method: selectedStudent ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentForm)
        }
      );

      closeStudentModal();
      await loadDashboardData();
    } catch (submitError) {
      setStudentFormErrorMessage(
        submitError.message || "Unable to save student details."
      );
      return;
    }
  };

  const handleStudentDelete = async (studentId) => {
    try {
      await requestJson(`/students/${studentId}`, {
        method: "DELETE"
      });

      if (selectedStudent?._id === studentId) {
        closeStudentModal();
      }

      await loadDashboardData();
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete student.");
    }
  };

  const handleAttendanceSubmit = async (event) => {
    event.preventDefault();

    setAttendanceError("");

    try {
      await requestJson("/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attendanceForm)
      });

      setAttendanceForm(emptyAttendanceForm);
      await loadDashboardData();
    } catch (submitError) {
      setAttendanceError(submitError.message || "Unable to save attendance.");
      return;
    }
  };

  const handleClassSubmit = async (event) => {
    event.preventDefault();

    try {
      await requestJson("/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classForm)
      });

      setClassForm(emptyClassForm);
      await loadDashboardData();
    } catch (submitError) {
      setError(submitError.message || "Unable to save class entry.");
    }
  };

  const handleFeeSubmit = async (event) => {
    event.preventDefault();

    try {
      await requestJson("/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...feeForm,
          feeAmount: Number(feeForm.feeAmount)
        })
      });

      setFeeForm(emptyFeeForm);
      await loadDashboardData();
    } catch (submitError) {
      setError(submitError.message || "Unable to save fee payment.");
    }
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
