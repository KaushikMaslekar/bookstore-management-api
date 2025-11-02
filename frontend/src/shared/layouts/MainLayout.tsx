import { Outlet } from "react-router-dom";
import { useState } from "react";
import NavMenu from "../components/NavMenu";

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="/">
            📚 Bookstore Management
          </a>
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleDrawerToggle}
            aria-controls="navbarNav"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${mobileOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <NavMenu onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main
        className="flex-grow-1 py-4"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        <div className="container">
          <div className="row">
            {/* Sidebar for larger screens */}
            <aside className="col-12 col-lg-3 mb-3 mb-lg-0">
              <div className="card border-0 h-100">
                <div className="card-body p-3">
                  {/* Reuse NavMenu in sidebar variant */}
                  <NavMenu
                    onClose={() => setMobileOpen(false)}
                    variant="sidebar"
                  />
                </div>
              </div>
            </aside>

            {/* Main content area */}
            <section className="col-12 col-lg-9">
              <div className="fade-in">
                <Outlet />
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-3 mt-auto">
        <div className="container text-center">
          <p className="mb-0">
            &copy; 2025 Bookstore Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
