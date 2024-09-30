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


// IMPORTANT THISIS WHY WE REALLY WANT STORAGE THE KEY PT IS WE CAN CHECK IT VIA AUTHORIZED
// AND AUTHORIZED BY CHECKING IT WILL KNOW OK NOW CAN RENDER CHILDREN ITS DIRECTLY CHECKING 
//Check for User in localStorage: The Authorized component checks if there's an item in localStorage with the key "NSSProject_user". 
//This indicates whether or not a user is logged in. If the user is logged in, their information is stored in localStorage from the login process.