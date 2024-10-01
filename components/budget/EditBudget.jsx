import { useState, useEffect } from 'react';
import { getBudgetsByUserId } from '../../services/BudgetService'; // Assuming you already have this

export const EditBudget = () => {
  const user = JSON.parse(localStorage.getItem("NSSProject_user"));
  const customerId = user?.id; // This retrieves the customerId if the user is logged in

  // Define the states you'll need
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null); // To hold the budget user wants to edit
  const [editedBudget, setEditedBudget] = useState({}); // To hold the updated budget info
  const [budgetsChecked, setBudgetsChecked] = useState([]);

  // Fetch budgets on component mount
  useEffect(() => {
    getBudgetsByUserId(customerId).then((data) => {
      setBudgets(data); // Set the fetched budgets in state
    });
  }, [budgets, customerId]);

  const chosenBudget = (event) => {
    const budgetId = parseInt(event.target.value, 10);

    const ourBudget = budgets.find((budget) => budget.id === budgetId);
    setSelectedBudget(ourBudget);
  };

  const updateBudget = (event) => {
    const copy = { ...selectedBudget };
    copy[event.target.id] = event.target.value;
    setEditedBudget(copy);
  };

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const budgetId = parseInt(event.target.value, 10); // Get the budgetId from the checkbox value
  
    // Find the budget corresponding to this budgetId
    const selectedBudget = budgets.find(budget => budget.id === budgetId);
  
    if (isChecked) {
      // Add the selected budget to checked budgets
      setBudgetsChecked([...budgetsChecked, selectedBudget]);
    } else {
      // Remove the selected budget from checked budgets
      setBudgetsChecked(budgetsChecked.filter((b) => b.id !== selectedBudget.id));
    }
  };
  

  //  const isBudgetChecked = (budget) => { ALSO RIGHT 
//     return budgetsChecked.some((b) => b.id === budget.id);
//   };

const isBudgetChecked = (budget) => {
    const parameterBudgetId = budget.id;
  
    const isItChecked = budgetsChecked.find((eachBudgetChecked) => {
      return eachBudgetChecked.id === parameterBudgetId;
    });
  
    return isItChecked ? true : false; // Return true if found, otherwise false
  };


  return (
    <>
      <h1>Budgets Available for Editing</h1>

      {/* Select Budget Dropdown */}
      <select id="myBudget" onChange={(e) => chosenBudget(e)}>
        <option value=""> Select a Budget </option>
        {budgets.map((eachBudget) => (
          <option key={eachBudget.id} value={eachBudget.id}>
            {eachBudget.budget_name} - Remaining Balance:{" "}
            {eachBudget.remaining_balance}
          </option>
        ))}
      </select>

   {/* Display Information for All Budgets */}
   {budgets.map((budget) => {
      // Move the logic outside JSX
      const isChecked = isBudgetChecked(budget); // Check if this budget is in the checked list
      return (
        <div key={budget.id}>
          <label>
            <input 
              type="checkbox"
              name="budget_name"
            value={budget.id}  // Add this so that you get the budget ID in handleCheckboxChange When a user clicks on a checkbox, it sends a change event to the onChange handler (handleCheckboxChange in this case). By setting the value attribute on the checkbox (value={budget.id}), you're associating each checkbox with a specific budget.id.
            checked={isBudgetChecked(budget)}  // Whether this specific checkbox is checked THIS ONLY CONTROLS VISUALLY IF THE BOX IS CHECKED NOT THE LOGIC OF DISPLAYING IF CHECKED ITS JUST A VISUAL 
            onChange={handleCheckboxChange}
   />
            Budget Name {budget.budget_name}
          </label>
          
          {/* Conditionally display budget details */}
          {isChecked && (
            <div>
              <h2>Budget Details for {budget.budget_name}</h2>
              <ul>
                <li>Budget Name: {budget.budget_name}</li>
                <li>
                  Category:{" "}
                  {budget.category
                    ? budget.category.category_description
                    : "Unknown"}
                </li>
                <li>Allocated Amount: {budget.allocated_amount}</li>
                <li>Spent Amount: {budget.spent_amount}</li>
                <li>Remaining Balance: {budget.remaining_balance}</li>
                <li>Days Left: {budget.days_left}</li>
              </ul>
            </div>
          )}
        </div>
      );
    })}

      {selectedBudget && (
        <fieldset>
            <h1> Edit Budget Form </h1>
          <article>

            current allocated amount {selectedBudget.allocated_amount}
          </article>

          <input
            onChange={(e) => updateBudget(e)}
            type="number"
            id="allocated_amount"
            placeholder="what is allocated amount for this"
          />
        </fieldset>
      )}
    </>
  );
};    
