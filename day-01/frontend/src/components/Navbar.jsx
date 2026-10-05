import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "active" : ""
        }
      >
        Home
      </NavLink>

      {" | "}

      <NavLink
        to="/users"
        className={({ isActive }) =>
          isActive ? "active" : ""
        }
      >
        Users
      </NavLink>

      {" | "}

      <NavLink
        to="/user-search"
        className={({ isActive }) =>
          isActive ? "active" : ""
        }
      >
        User Search
      </NavLink>
    </nav>
  );
}

export default Navbar;