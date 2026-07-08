import { Link } from "react-router-dom";
import {
  Search,
  House,
  PlusCircle,
  Shield,
  User,
  LogOut,
} from "lucide-react";

export default function Navbar({ user, token, handleLogout }) {
  return (
    <nav className="navbar">


      <div className="nav-links">
        <Link to="/">
          <House size={20} />
          Početna
        </Link>

        {token && (
          <Link to="/add-item">
            <PlusCircle size={20} />
            Dodaj predmet
          </Link>
        )}
      </div>

      <div className="user-menu">

        {user?.role_id === 1 && (
          <Link className="admin-link" to="/admin">
            <Shield size={18} />
            Admin panel
          </Link>
        )}

        {token ? (
          <>
            <span className="user-name">
              <User size={18} />
              {user.role_id === 1
                ? "Admin"
                : user.first_name}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Prijava</Link>
            <Link to="/register">Registracija</Link>
          </>
        )}

      </div>

    </nav>
  );
}