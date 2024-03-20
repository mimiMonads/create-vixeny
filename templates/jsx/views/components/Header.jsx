import React from "react";

const Header = () => (
  <header>
    <nav>
      <a
        href="/"
        style={{ color: "white", textDecoration: "none", margin: "0 15px" }}
      >
        Home
      </a>
      <a
        href="/docs"
        style={{ color: "white", textDecoration: "none", margin: "0 15px" }}
      >
        Docs
      </a>
    </nav>
  </header>
);

export default Header;
