import { useEffect, useState } from 'react';
import './FilteredBudget.css'; 

export const FilteredBudget = ({filterTerm, userId, budgets}) => {
  const [budgetDisplayed, setBudgetDisplayed] = useState([]);

  useEffect(() => {
    const data = filterFunction(filterTerm, budgets);
    if (data) {
      setBudgetDisplayed(data);
    }
  }, [filterTerm, budgets]);

  const filterFunction = (filterTerm, budgets) => {
    const searchTerm = String(filterTerm).toLowerCase();

    const ourFilteredValue = budgets.filter((budget) => {
      // const keys = Object.keys(budget);
      const values = Object.values(budget);

      const matchingValues = values.filter((eachValue) => {
        if (eachValue != null) {
          return String(eachValue).toLowerCase().includes(searchTerm);
        }
        return false;
      });
      return matchingValues.length > 0;
    });

    return ourFilteredValue;
  };

  return (
    <div>
      <div className="heading-container">
        <h1>Your Filtered Budgets</h1>
      </div>
      {budgetDisplayed.length > 0 && (
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
            {budgetDisplayed.map((budget, index) => (
              <tr key={index}>
                <td> {budget.budget_name}</td>
                <td>
                  {" "}
                  {budget.category
                    ? budget.category.category_description
                    : "Unknown"}
                </td>
                <td> {budget.allocated_amount} </td>
                <td> {budget.spent_amount} </td>
                <td> {budget.remaining_balance} </td>
                <td> {budget.days_left} </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}