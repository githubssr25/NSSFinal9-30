import { useState, useEffect } from "react";
import {
  getBudgetsByUserId,
  deleteBudgetById,
} from "../../services/BudgetService"; 
import "./DeleteBudget.css"; 

export const DeleteBudget = () => {
  const user = JSON.parse(localStorage.getItem("NSSProject_user"));
  const customerId = user?.id;

  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [deletedBudget, setDeletedBudget] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    getBudgetsByUserId(customerId).then((data) => {
      setBudgets(data); 
    });
  }, [customerId]);
  const handleSelect = (event) => {
    const budgetId = parseInt(event.target.value, 10);
    const ourBudget = budgets.find((budget) => budget.id === budgetId);
    setSelectedBudget(ourBudget);
    setIsDeleted(false); 
  };

  const handleDelete = () => {
    if (selectedBudget && selectedBudget.id) {
      deleteBudgetById(selectedBudget.id).then((response) => {
        if (response) {
          setIsDeleted(true);
          setDeletedBudget(selectedBudget); 
          setBudgets(
            budgets.filter((budget) => budget.id !== selectedBudget.id)
          ); 
          setSelectedBudget(null); 
        }
      });
    }
  };
  return (
    <>
       <div className="delete-budget-header">
      <h1>Delete Budget</h1>
    </div>


      <div className="budget-info-container">
        <select id="deleteBudgetSelect" onChange={handleSelect}>
          <option value="">Select a Budget to Delete</option>
          {budgets.map((budget) => (
            <option key={budget.id} value={budget.id}>
              {budget.budget_name} - Remaining Balance: ${budget.remaining_balance}
            </option>
          ))}
        </select>

        {selectedBudget && (
          <div className="selected-budget-container">
            <h2>Selected Budget: {selectedBudget.budget_name}</h2>
            <p>
              Category:{" "}
              {selectedBudget.category?.category_description || "Unknown"}
            </p>
            <p>Allocated Amount: ${selectedBudget.allocated_amount}</p>
            <p>Spent Amount: ${selectedBudget.spent_amount}</p>
            <p>Remaining Balance: ${selectedBudget.remaining_balance}</p>
            <p>Days Left: {selectedBudget.days_left}</p>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
  

        {isDeleted && deletedBudget && (
          <div className="success-message">
            <h3>Budget {deletedBudget.budget_name} deleted successfully!</h3>
            <p>
              Category:{" "}
              {deletedBudget.category?.category_description || "Unknown"}
            </p>
          </div>
        )}
      </div>
    </>
  );
  
};
