import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", short: "DB" },
  { to: "/products", label: "Products", short: "PR" },
  { to: "/customers", label: "Customers", short: "CU" },
  { to: "/orders", label: "Orders", short: "OR" },
  { to: "/inventory", label: "Inventory Log", short: "IL" },
];

export function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">SF</span>
          <div>
            <strong>StockFlow</strong>
            <small>Operations Suite</small>
          </div>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"}>
              <span>{link.short}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot" />
          API connected
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

