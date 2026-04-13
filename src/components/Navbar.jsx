const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "attendance", label: "Attendance" },
  { id: "classes", label: "Classes" },
  { id: "fees", label: "Fees" }
];

function Navbar({ currentPage, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="brand-block">

        <div>
            <strong>SMS Panel</strong>
        </div>
      </div>
      <div className="nav-links">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={currentPage === item.id ? "nav-btn active" : "nav-btn"}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
