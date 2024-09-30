import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import { Login } from "./components/auth/Login";  
import {ApplicationViews} from "./components/views/ApplicationViews"
import { Authorized } from "./components/views/Authorized";
import { Register } from "./components/auth/Register"; 


function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Routes>
      <Route
      path="/login"
      element={<Login setCurrentUser={setCurrentUser} currentUser={currentUser} />}
      />
        <Route path="/register" element={<Register />} />

        {/* Catch-all route for the main app */}
        <Route
        path="*"
        element={
          <Authorized>
            <ApplicationViews setCurrentUser={setCurrentUser} currentUser={currentUser} />
          </Authorized>
        }
      />
     
    </Routes>
  )
}

export default App
