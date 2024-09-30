
import { Link } from 'react-router-dom';

export const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/view-budget">View A Budget</Link></li>
        <li><Link to="/view-all-budgets">View All Budgets</Link></li>
        <li><Link to="/add-budget">Add New Budget</Link></li>
        <li><Link to="/enter-money-spent">Add Money Spent To A Budget</Link></li>
        <li><Link to="/login">Log Out</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
