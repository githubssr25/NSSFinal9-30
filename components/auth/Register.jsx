import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getUserByEmail, createUser } from "../../services/userService"; // Import service functions

export const Register = ({ setCurrentUser }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });
  let navigate = useNavigate();

  const registerNewUser = () => {
    const newUser = { ...user };

    // Create the new user
    createUser(newUser).then((createdUser) => {
      if (createdUser.hasOwnProperty("id")) {
        // Store the new user in localStorage
        localStorage.setItem(
          "NSSProject_user",
          JSON.stringify({
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
          })
        );
        setCurrentUser(createdUser); // Set the user in app state
        navigate("/"); // Redirect to home page
      }
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Check if a user already exists with the entered email
    getUserByEmail(user.email).then((existingUser) => {
      if (existingUser.length > 0) {
        window.alert("Account with that email address already exists");
      } else {
        registerNewUser();
      }
    });
  };

  const updateUser = (evt) => {
    const copy = { ...user };
    copy[evt.target.id] = evt.target.value; // Update the user state based on input fields
    setUser(copy);
  };

  return (
    <main className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h1 className="header">NSS Final Project Budgets</h1>
        <h2>Please Register</h2>

        <fieldset>
          <input
            onChange={updateUser}
            type="text"
            id="name"
            placeholder="Your name"
            required
          />
        </fieldset>
        <fieldset>
          <input
            onChange={updateUser}
            type="email"
            id="email"
            placeholder="Email address"
            required
          />
        </fieldset>
        <fieldset>
          <input
            onChange={updateUser}
            type="password"
            id="password"
            placeholder="Password"
            required
          />
        </fieldset>
        <button type="submit">Register</button>
      </form>
      <Link to="/login">Already a member? Sign in here.</Link>
    </main>
  );
};
