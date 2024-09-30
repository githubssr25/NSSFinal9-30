import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"
import {getUserByEmail} from "../../services/UserService"


export const Login = ({ setCurrentUser, currentUser }) => {
    const [email, set] = useState("");  // Input for email
    const navigate = useNavigate();  // Hook for navigation after login
  
    const handleLogin = (e) => {
      e.preventDefault();
  
      // Simulating an API call or database lookup to find user by email
      return getUserByEmail(email).then((foundUsers) => {
        if (foundUsers.length === 1) {
          const customer = foundUsers[0];
          // Storing the authenticated user's information in localStorage
          localStorage.setItem(
            "rosesThorns_user",
            JSON.stringify({
              id: customer.id,
              name: customer.name,
              businessName: customer.businessName,
              email: customer.email,
            })
          );
          // Setting the user in the current app state
          setCurrentUser(customer);
  
          // Redirecting the user to the home page ("/")
          navigate("/");
        } else {
          // Alert user if login fails
          window.alert("Invalid login");
        }
      });
    };
  
    return (
      <main className="auth-container">
        <section>
          <form className="auth-form" onSubmit={handleLogin}>
            <h1 className="header">Roses and Thorns</h1>
            <h2>Please sign in</h2>
            <input
              type="email"
              value={email}
              onChange={(evt) => set(evt.target.value)}
              placeholder="Email address"
              required
              autoFocus
            />
            <button type="submit">Sign in</button>
          </form>
        </section>
        <Link to="/register">Not a member yet?</Link>
      </main>
    )
  }