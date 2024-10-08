
import { Link } from 'react-router-dom';
import './navbar.css';

export const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/viewAllBudgets">View All Budgets</Link></li>
        <li><Link to="/addNewBudget">Add New Budget</Link></li>
        <li><Link to="/enterMoneySpent">Add Money Spent To A Budget</Link></li>
        <li><Link to="/login">Log Out</Link></li>
        <li> <Link to="/editBudget"> Edit Budget </Link></li>
        <li> <Link to="/deleteBudget"> Delete Budget </Link></li>
        <li> <Link to="/productInfo"> Search For Product Info </Link></li>
        <li> <Link to="/stores"> Search For Stores </Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
