import { Link } from 'react-router-dom';
import { useState } from 'react';
import { LatestNotifications } from "../notifications/LatestNotifications";
import './navbar.css';

export const NavBar = ({finishedEditing}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleNotifications = () => {
    setIsExpanded(!isExpanded); // Toggle expanded state
  };

  return (
    <nav>
      <ul className="navbar-list">
        <li><Link to="/viewAllBudgets">View All Budgets</Link></li>
        <li><Link to="/addNewBudget">Add New Budget</Link></li>
        <li><Link to="/enterMoneySpent">Add Money Spent To A Budget</Link></li>
        <li><Link to="/login">Log Out</Link></li>
        <li><Link to="/editBudget">Edit Budget</Link></li>
        <li><Link to="/deleteBudget">Delete Budget</Link></li>
        <li><Link to="/productInfo">Search For Product Info From Targets Across the US To Help With Budgeting</Link></li>
        <li><Link to="/stores">Search For Nearest Target Stores</Link></li>
      </ul>

      <div className={`notification-container ${isExpanded ? 'expanded' : ''}`}>
        <button onClick={toggleNotifications} className="toggle-btn">
          {isExpanded ? 'Hide Notifications' : 'Show Notifications'}
        </button>
        {isExpanded && <LatestNotifications />}
      </div>
    </nav>
  );
};

export default NavBar;

