import { useEffect, useState } from 'react';

import { getCategories, getBudgetsByUserId } from "../../services/BudgetService"; // Adjust path as needed


export const ViewAllBudgets = () => {
  const user = JSON.parse(localStorage.getItem("NSSProject_user"));
  const customerId = user?.id;

  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    getBudgetsByUserId(customerId).then((data) => {
      setBudgets(data);
    });
  }, [customerId]);

  return (
    <div>
      <h1> Your Budgets </h1>
      {budgets.length > 0 ? (
        budgets.map((budget, index) => {
          return (
            <div key={index}>
              <h3> Budget {budget.budget_name} </h3>
              <p>
                {" "}
                Category{" "}
                {budget.category
                  ? budget.category.category_description
                  : "Unknown"}
              </p>
              <table>
                <thead>
                  <tr>
                    <th> Allocated Amount </th>
                    <th> Amount Spent So Far </th>
                    <th> Remaining Balance </th>
                    <th> Days Left Of Budget </th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={index}>
                    <td> {budget.allocated_amount}</td>
                    <td> {budget.spent_amount}</td>
                    <td> {budget.remaining_balance}</td>
                    <td> {budget.days_left}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })
      ) : (
        <p> no budgets found </p>
      )}
    </div>
  );
}