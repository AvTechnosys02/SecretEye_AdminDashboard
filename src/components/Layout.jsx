// src/components/Layout.jsx

import PropTypes from "prop-types"; // Import PropTypes
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <main className=" h-full bg-primary p-4" >{children}</main>
      </div>
    </div>
  );
};

// Adding PropTypes for children
Layout.propTypes = {
  children: PropTypes.node.isRequired, // children can be any renderable content
};

export default Layout;
