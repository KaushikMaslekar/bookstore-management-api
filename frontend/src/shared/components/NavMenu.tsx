import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavMenuProps {
  onClose?: () => void;
  variant?: "horizontal" | "sidebar"; // horizontal (navbar) or sidebar (vertical nav)
}

export const NavMenu: React.FC<NavMenuProps> = ({
  onClose,
  variant = "horizontal",
}) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/books", label: "📖 Books", icon: "bi-book" },
    { path: "/books/new", label: "➕ Add Book", icon: "bi-plus-circle" },
    { path: "/authors", label: "👤 Authors", icon: "bi-person" },
    { path: "/authors/new", label: "➕ Add Author", icon: "bi-plus-circle" },
    { path: "/categories", label: "📂 Categories", icon: "bi-folder" },
    {
      path: "/categories/new",
      label: "➕ Add Category",
      icon: "bi-plus-circle",
    },
  ];

  if (variant === "sidebar") {
    return (
      <ul className="nav flex-column sidebar-nav">
        {navItems.map((item) => (
          <li className="nav-item mb-1" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center px-3 py-2 rounded ${
                isActive(item.path)
                  ? "bg-white text-primary fw-semibold"
                  : "text-dark"
              }`}
              onClick={onClose}
              style={{ transition: "all 0.2s ease" }}
            >
              <i className={`bi ${item.icon} me-2`} aria-hidden />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      {navItems.map((item) => (
        <li className="nav-item" key={item.path}>
          <Link
            to={item.path}
            className={`nav-link px-3 py-2 rounded ${
              isActive(item.path)
                ? "bg-light text-primary fw-semibold"
                : "text-white"
            }`}
            onClick={onClose}
            style={{
              transition: "all 0.3s ease",
              marginRight: "0.5rem",
            }}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavMenu;
