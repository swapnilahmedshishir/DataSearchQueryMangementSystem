import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

// Create the context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [state, setState] = useState({ port: "http://localhost:8080" });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

// Define prop types for AppProvider
AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
