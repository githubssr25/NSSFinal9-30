import { useEffect, useState } from 'react';
import {FilteredBudget} from "./FilteredBudget";
import { getBudgetsByUserId } from "../../services/BudgetService"; 
import './ViewAllBudgets.css'; 

export const ViewAllBudgets = () => {
  const user = JSON.parse(localStorage.getItem("NSSProject_user"));
  const customerId = user?.id;

  const [budgets, setBudgets] = useState([]);
  const [filterTerm, setFilterTerm] = useState('');

  useEffect(() => {
    if (customerId) {
      getBudgetsByUserId(customerId).then((data) => {
        setBudgets(data);
      }).catch((error) => {
        console.error('Error fetching budgets:', error);
      });
    } else {
      console.warn('No customerId found, skipping budget fetch');
    }
  }, [customerId]);

  
  return (
    <div className="budget-container">
      <div
        style={{
          width: "100%",
          maxWidth: "200px",
          margin: "0 auto 20px",
          padding: "5px 5px 5px 0",
          boxSizing: "border-box",
        }}
      >
        <input
          type="text"
          placeholder="filter by the budgets characteristics"
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            fontSize: "0.9rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth:
            "200px",
          margin: "10px auto" /* Center it horizontally */,
          padding: "5px" 
        }}
      >
        <div className="budget-header">
        <h1>Your Budgets</h1>
        </div>
      </div>

      {budgets.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Budget Name</th>
              <th>Category</th>
              <th>Allocated Amount</th>
              <th>Amount Spent So Far</th>
              <th>Remaining Balance</th>
              <th>Days Left Of Budget</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget, index) => (
              <tr key={index}>
                <td>{budget.budget_name}</td>
                <td>
                  {budget.category
                    ? budget.category.category_description
                    : "Unknown"}
                </td>
                <td>{budget.allocated_amount}</td>
                <td>{budget.spent_amount}</td>
                <td>{budget.remaining_balance}</td>
                <td>{budget.days_left}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No budgets found</p>
      )}

      {filterTerm && (
        <FilteredBudget
          filterTerm={filterTerm}
          userId={customerId}
          budgets={budgets}
        />
      )}
    </div>
  );
}  