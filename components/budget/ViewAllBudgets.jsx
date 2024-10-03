import { useEffect, useState } from 'react';
import {FilteredBudget} from "./FilteredBudget";
import { getBudgetsByUserId } from "../../services/BudgetService"; // Adjust path as needed
import './ViewAllBudgets.css'; // Import the CSS file

export const ViewAllBudgets = () => {
  const user = JSON.parse(localStorage.getItem("NSSProject_user"));
  const customerId = user?.id;

  const [budgets, setBudgets] = useState([]);
  const [filterTerm, setFilterTerm] = useState('');

 // Console log for user and customerId
  console.log('User:', user);
  console.log('Customer ID:', customerId);

  useEffect(() => {
    if (customerId) {
      getBudgetsByUserId(customerId).then((data) => {
        // Log data retrieved from the service
        console.log('Budgets fetched:', data);
        setBudgets(data);
      }).catch((error) => {
        // Log if there's an error fetching the data
        console.error('Error fetching budgets:', error);
      });
    } else {
      console.warn('No customerId found, skipping budget fetch');
    }
  }, [customerId]);

  return (
    <div>
        <input 
        type="text"
        placeholder="filter by the budgets characteristics"
        value={filterTerm}
        onChange={(e) => setFilterTerm(e.target.value)}
        />

      <h1> Your Budgets </h1>
      {budgets.length > 0 ? (
              <table>
                <thead>
                  <tr>
                 <th> Budget Name </th>
              <th> Category </th>
              <th> Allocated Amount </th>
              <th> Amount Spent So Far </th>
              <th> Remaining Balance </th>
              <th> Days Left Of Budget </th>
                  </tr>
                </thead>
                <tbody>
                    { budgets.map((budget, index) => {
                        return (
                  <tr key={index}>
                <td> {budget.budget_name}</td>
                <td> {budget.category ? budget.category.category_description : "Unknown"} </td>
                <td> {budget.allocated_amount} </td>
                <td> {budget.spent_amount} </td>
                <td> {budget.remaining_balance} </td>
                <td> {budget.days_left} </td>
                  </tr>
                        )
                    })
                }
                </tbody>
              </table>
          ) : (
        <p> no budgets found </p>
      )}


{ filterTerm && (
            <FilteredBudget filterTerm={filterTerm} userId={customerId} budgets={budgets}/>
        )
      }
    </div>
  );
}