import { width, darkGrey, lightGrey } from "../../../utils";
import NavLink from "../../NavLink";
import Logo from "../../Logo";

const navItems = [
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "Log in", path: "/login" },
  { name: "Sign up", path: "/signup" }
];

const Nav = () => (
  <div>
    <div className="header-container">
      <Logo />

      <ul className="nav-items">
        {navItems.map(navItem => (
          <NavLink href={navItem.path} key={navItem.name}>
            <a className="nav-link">{navItem.name}</a>
          </NavLink>
        ))}
      </ul>
    </div>
    <style jsx>{`
      background-color: ${darkGrey};

      .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 72px;
        max-width: ${width.desktopHD}px;
        margin: 0 auto;
        padding: 0 20px;
      }

      .nav-items {
        display: flex;
        align-items: center;
        height: 100%;
      }

      .nav-link {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 10px;
        color: #ffffff;
      }

      .nav-link.active {
        background-color: ${lightGrey};
      }

      .nav-link:last-child {
        margin-right: 0;
      }
    `}</style>
  </div>
);

export default Nav;
