import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"
import {getUserByEmail} from "../../services/UserService"
import "./Login.css"; 


export const Login = ({ setCurrentUser, currentUser }) => {
    const [email, setEmail] = useState("");  // Input for email
    const navigate = useNavigate();  // Hook for navigation after login

    const handleLogin = async (e) => {
      e.preventDefault();

      console.log("Attempting login with email:", email); // Debugging log

      try {
        const foundUsers = await getUserByEmail(email);
        console.log("Received response:", foundUsers);  // Debug log

        if (foundUsers.length === 1) {
          const user = foundUsers[0];
          console.log("User found:", user);  // Debug log

          // Storing the authenticated user's information in localStorage
          localStorage.setItem(
            "NSSProject_user",
            JSON.stringify({
              id: user.id,  // Use 'id' now
              name: user.name,
              email: user.email
            })
          );
          // Set the user in the current app state
          setCurrentUser(user);

          // Redirect to home page
          navigate("/");
        } else {
          window.alert("Invalid login");
        }
      } catch (error) {
        console.error("Error during login:", error);
        window.alert("Login failed due to an error.");
      }
    };
  
    return (
      <main className="auth-container">
        <section>
          <form className="auth-form" onSubmit={handleLogin}>
            <h1 className="header">NSS Final Project</h1>
            <h2>Please sign in</h2>
            <input
              type="email"
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
              placeholder="Email address"
              required
              autoFocus
            />
            <button className="sign-in-button" type="submit">Sign in</button>
          </form>
        </section>
        <Link to="/register">Not a member yet?</Link>
      </main>
    );
  };