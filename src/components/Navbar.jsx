const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "attendance", label: "Attendance" },
  { id: "classes", label: "Classes" },
  { id: "fees", label: "Fees" }
];

function Navbar({ currentPage, isNavigating, pendingPage, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="brand-block">
        <div>
          <strong>SMS Panel</strong>
          <p>Manage students, attendance, classes, and fees.</p>
        </div>
      </div>
      <div className="nav-links">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={currentPage === item.id ? "nav-btn active" : "nav-btn"}
            disabled={isNavigating}
            onClick={() => onNavigate(item.id)}
          >
            {isNavigating && pendingPage === item.id ? (
              <span className="spinner tiny" aria-hidden="true" />
            ) : null}
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
