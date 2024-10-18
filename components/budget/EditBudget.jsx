import { useState, useEffect } from 'react';
import { getBudgetsByUserId, editBudget } from '../../services/BudgetService'; // Assuming you already have this
import { getAllCategories} from "../../services/CategoryService"
import './EditBudget.css';

export const EditBudget = () => {
  const user = JSON.parse(localStorage.getItem("NSSProject_user"));
  const customerId = user?.id; // This retrieves the customerId if the user is logged in

  // Define the states you'll need
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState({}); // To hold the budget user wants to edit
  const [editedBudget, setEditedBudget] = useState({}); // To hold the updated budget info
  const [budgetsChecked, setBudgetsChecked] = useState([]);
  const [isEdited, setIsEdited] = useState(false); 
  const [categories, setCategories] = useState([]);
  const [cantCompleteAlert, setCantCompleteAlert] = useState(false);
  const [successfulBudget, setSuccessfulBudget] = useState(null); // New state to store the successful edit


  // Fetch budgets on component mount
  useEffect(() => {
    getBudgetsByUserId(customerId).then((data) => {
      setBudgets(data); // Set the fetched budgets in state
    });
  }, [budgets, customerId]);

  useEffect(() => {
    getAllCategories().then((data) => {
      setCategories(data);
    })
  }, []);

  useEffect(() => {
    setCantCompleteAlert(false);
  }, [editedBudget, selectedBudget])

  const chosenBudget = (event) => {
    const budgetId = parseInt(event.target.value, 10);

    const ourBudget = budgets.find((budget) => budget.id === budgetId);
    setSelectedBudget(ourBudget);
    setEditedBudget(ourBudget); // Also set the edited budget initially THIS IS WHAT WE NEED TO 
    //CHANGE IN ORDER TO ACUTALLY BE ABLE OT EDIT LIKE 500 TO 250 WITHOUT IT AUTOMATICALLY RESETTING BACK TO 250 INBOX
    setIsEdited(false);  // Reset success message when new budget is chosen YOU NEED TO RE-SET THIS WHEN CHOOSING A NEW ONE
  };

  const updateBudget = (event) => {
    const copy = { ...editedBudget };
    copy[event.target.id] = event.target.value;
    setEditedBudget(copy);
  };

  const updateCategories = (event) => {
    const categoryId = event.target.value;
    const copy = { ...editedBudget };
    copy.categoryId = categoryId;  // Directly set the categoryId field in the budget
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

  const handleEdit = () => {

      // Check if the spent amount exceeds the allocated amount
      if (editedBudget.spent_amount > editedBudget.allocated_amount) {
        let value = editedBudget.spent_amount - editedBudget.allocated_amount;
        alert(`Warning your spent amount exceeds what your new edited allocated budget would be by ${value}`);
        setCantCompleteAlert(true);
        return;
      }
  
      // Case 1: If allocated_amount < remaining_balance, cap remaining_balance
      if (editedBudget.allocated_amount < editedBudget.remaining_balance) {
        editedBudget.remaining_balance = editedBudget.allocated_amount;
      }
  
      // Case 2: If allocated_amount increases, recalculate remaining_balance based on spent_amount
      if (selectedBudget.allocated_amount < editedBudget.allocated_amount) {
        editedBudget.remaining_balance = editedBudget.allocated_amount - selectedBudget.spent_amount;
      }

    const budgetToSend = {
      id: editedBudget.id,
      userId: customerId,
      categoryId: editedBudget.categoryId,
      allocated_amount: editedBudget.allocated_amount,
      spent_amount: editedBudget.spent_amount,
      remaining_balance: editedBudget.remaining_balance,
      days_left: editedBudget.days_left,
      budget_name: editedBudget.budget_name
    }

    editBudget(budgetToSend).then((data) => {
      if (data && data.id) {
        // Log success
        console.log("Budget edited successfully", data);
        
        // Update the budgets array with the edited budget
        setBudgets(budgets.map(b => b.id === data.id ? data : b));
    // /?data : b: If the id matches, it replaces the budget in the array with the updated data 
    // (edited budget). If not, it keeps the original budget (b) unchanged.
    setIsEdited(true);  
        // Store the successful edited budget separately
        setSuccessfulBudget(data);
  
       //reset selected budget also 
        setSelectedBudget({});
        setEditedBudget({});

        setCantCompleteAlert(false);  // Reset alert state after successful edit
      }
    });
  };


  return (
    <>
         {/* Header Section */}
    <div className="header-container">
      <h1>Budgets Available for Editing</h1>
      <h1>To View the Full Details of Any Budget, Click the Check Box Next to It</h1>
    </div>

    {/* Dropdown to Select a Budget */}
    <div className="dropdown-container">
      <select id="myBudget" onChange={(e) => chosenBudget(e)}>
        <option value="">Select a Budget</option>
        {budgets.map((eachBudget) => (
          <option key={eachBudget.id} value={eachBudget.id}>
            {eachBudget.budget_name} - Remaining Balance: {eachBudget.remaining_balance}
          </option>
        ))}
      </select>
    </div>

    {/* Budgets List Section */}

      <div className="budgets-list-container">
      {budgets.map((budget) => {
        // Move the logic outside JSX
        const isChecked = isBudgetChecked(budget); // Check if this budget is in the checked list
        return (
          <div key={budget.id}>
            <label>
              <input
                type="checkbox"
                name="budget_name"
                value={budget.id} // Add this so that you get the budget ID in handleCheckboxChange When a user clicks on a checkbox, it sends a change event to the onChange handler (handleCheckboxChange in this case). By setting the value attribute on the checkbox (value={budget.id}), you're associating each checkbox with a specific budget.id.
                checked={isBudgetChecked(budget)} // Whether this specific checkbox is checked THIS ONLY CONTROLS VISUALLY IF THE BOX IS CHECKED NOT THE LOGIC OF DISPLAYING IF CHECKED ITS JUST A VISUAL
                onChange={handleCheckboxChange}
              />
              Budget Name {budget.budget_name}
            </label>

            {/* Conditionally display budget details */}
            {isChecked && (
              <div className="budget-details">
                <h2>Budget Details for {budget.budget_name}</h2>
                <ul>
                  <li>Budget Name: {budget.budget_name}</li>
                  <li>Category: {budget.category?.category_description || "Unknown"}</li>
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
      </div>

  
    {/* Edit Budget Form */}
    {selectedBudget && (
      <fieldset className="edit-form-container">
        <h1>Edit Budget Form</h1>
        <article>
          <label>Budget Name</label>
          <input
            type="text"
            id="budget_name"
            value={editedBudget.budget_name || ""}
            onChange={updateBudget}
          />

          <label>Allocated Amount</label>
          <input
            type="number"
            id="allocated_amount"
            value={editedBudget.allocated_amount || ""}
            onChange={updateBudget}
          />

          <label>Days Left</label>
          <input
            type="number"
            id="days_left"
            value={editedBudget.days_left || ""}
            onChange={updateBudget}
          />

          <select id="myCategories" onChange={(e) => updateCategories(e)}>
            <option value="">Choose Budget Category to Edit</option>
            {categories.map((eachCategory) => (
              <option key={eachCategory.id} value={eachCategory.id}>
                {eachCategory.category_description}
              </option>
            ))}
          </select>

          <button type="button" onClick={handleEdit}>Save Changes</button>
        </article>
      </fieldset>
    )}
        {/* Success Message */}
    {isEdited && successfulBudget && (
      <div className="success-message">
        <h2>Successfully Edited Budget: {successfulBudget.budget_name}</h2>
        <ul>
          <li>Budget Name: {successfulBudget.budget_name}</li>
          <li>Allocated Amount: {successfulBudget.allocated_amount}</li>
          <li>Days Left: {successfulBudget.days_left}</li>
          <li>
            Category:{" "}
            {categories.find((c) => c.id === parseInt(successfulBudget.categoryId))?.category_description || "Unknown"}
          </li>
          <li>Remaining Balance: {successfulBudget.remaining_balance}</li>
        </ul>
      </div>
    )}

      {cantCompleteAlert && (
        <p>
          {" "}
          your transaction cannot be completed. Your spent amount{" "}
          {editedBudget.spent_amount} would exceed your allocated amount{" "}
          {editedBudget.allocated_amount}. Please try again and raise your
          allocated amount by at least{" "}
          {editedBudget.spent_amount - editedBudget.allocated_amount} to be able
          to successfully update your budget.{" "}
        </p>
      )}
    </>
  );
}
