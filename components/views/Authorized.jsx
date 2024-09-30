import { Navigate, useLocation } from "react-router-dom";

// This component checks if the user is authorized (logged in) and either renders its children or redirects the user to the login page.
export const Authorized = ({ children }) => {
  let location = useLocation();

  // Check if the user is logged in by seeing if the user is stored in localStorage
  if (localStorage.getItem("NSSProject_user")) {
    return children; // If user is logged in, render the children components
  } else {
    // If user is not logged in, redirect to login page with current location saved in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};
