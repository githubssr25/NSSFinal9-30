import { useState, useEffect } from 'react';
import { getBudgetsByUserId, editBudget } from '../../services/BudgetService'; 
import { getAllCategories} from "../../services/CategoryService"
import './EditBudget.css';

export const EditBudget = () => {
  const user = JSON.parse(localStorage.getItem('NSSProject_user'));
  const customerId = user?.id;

  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState({});
  const [editedBudget, setEditedBudget] = useState({});
  const [budgetsChecked, setBudgetsChecked] = useState([]);
  const [isEdited, setIsEdited] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cantCompleteAlert, setCantCompleteAlert] = useState(false);
  const [successfulBudget, setSuccessfulBudget] = useState(null);

  useEffect(() => {
    getBudgetsByUserId(customerId).then((data) => {
      setBudgets(data);
    });
  }, [customerId]);

  useEffect(() => {
    getAllCategories().then((data) => {
      setCategories(data);
    });
  }, []);

  useEffect(() => {
    setCantCompleteAlert(false);
  }, [editedBudget, selectedBudget]);

  const chosenBudget = (event) => {
    const budgetId = parseInt(event.target.value, 10);
    const ourBudget = budgets.find((budget) => budget.id === budgetId);

    setSelectedBudget(ourBudget);
    setEditedBudget(ourBudget);
    setIsEdited(false);
  };

  const updateBudget = (event) => {
    const copy = { ...editedBudget };
    copy[event.target.id] = event.target.value;
    setEditedBudget(copy);
  };

  const updateCategories = (event) => {
    const categoryId = event.target.value;
    const copy = { ...editedBudget };
    copy.categoryId = categoryId;
    setEditedBudget(copy);
  };

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const budgetId = parseInt(event.target.value, 10);
    const selectedBudget = budgets.find((b) => b.id === budgetId);

    if (isChecked) {
      setBudgetsChecked([...budgetsChecked, selectedBudget]);
    } else {
      setBudgetsChecked(budgetsChecked.filter((b) => b.id !== selectedBudget.id));
    }
  };

  const isBudgetChecked = (budget) => {
    return budgetsChecked.some((eachBudgetChecked) => eachBudgetChecked.id === budget.id);
  };

  const handleEdit = () => {
    if (editedBudget.spent_amount > editedBudget.allocated_amount) {
      let value = editedBudget.spent_amount - editedBudget.allocated_amount;
      alert(
        `Warning: Your spent amount exceeds the new allocated budget by ${value}. Please increase the allocated amount.`
      );
      setCantCompleteAlert(true);
      return;
    }

    if (editedBudget.allocated_amount < selectedBudget.allocated_amount) {
      editedBudget.remaining_balance = Math.max(
        0,
        editedBudget.allocated_amount - editedBudget.spent_amount
      );
    } else {
      const balanceIncrease = editedBudget.allocated_amount - selectedBudget.allocated_amount;
      editedBudget.remaining_balance = selectedBudget.remaining_balance + balanceIncrease;
    }

    if (editedBudget.allocated_amount < editedBudget.remaining_balance) {
      alert(
        `Allocated amount cannot be less than the remaining balance. Please increase the allocated amount.`
      );
      setCantCompleteAlert(true);
      return;
    }

    const budgetToSend = {
      id: editedBudget.id,
      userId: customerId,
      categoryId: editedBudget.categoryId,
      allocated_amount: editedBudget.allocated_amount,
      spent_amount: editedBudget.spent_amount,
      remaining_balance: editedBudget.remaining_balance,
      days_left: editedBudget.days_left,
      budget_name: editedBudget.budget_name,
    };

    editBudget(budgetToSend).then((data) => {
      if (data && data.id) {
        setBudgets(budgets.map((b) => (b.id === data.id ? data : b)));
        setIsEdited(true);
        setSuccessfulBudget(data);
        setSelectedBudget({});
        setEditedBudget({});
        setCantCompleteAlert(false);
      }
    });
  };

  return (
    <>
      <div className="header-container">
        <h1>Budgets Available for Editing</h1>
        <h1>To View the Full Details of Any Budget, Click the Check Box Next to It</h1>
      </div>

      <div className="dropdown-container">
        <select id="myBudget" onChange={chosenBudget}>
          <option value="">Select a Budget</option>
          {budgets.map((eachBudget) => (
            <option key={eachBudget.id} value={eachBudget.id}>
              {eachBudget.budget_name} - Remaining Balance: {eachBudget.remaining_balance}
            </option>
          ))}
        </select>
      </div>

      <div className="budgets-list-container">
        {budgets.map((budget) => {
          const isChecked = isBudgetChecked(budget);
          return (
            <div key={budget.id}>
              <label>
                <input
                  type="checkbox"
                  name="budget_name"
                  value={budget.id}
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                Budget Name: {budget.budget_name}
              </label>

              {isChecked && (
                <div className="budget-details">
                  <h2>Budget Details for {budget.budget_name}</h2>
                  <ul>
                    <li>Budget Name: {budget.budget_name}</li>
                    <li>Category: {budget.category?.category_description || 'Unknown'}</li>
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

      {selectedBudget && (
        <fieldset className="edit-form-container">
          <h1>Edit Budget Form</h1>
          <article>
            <label>Budget Name</label>
            <input
              type="text"
              id="budget_name"
              value={editedBudget.budget_name || ''}
              onChange={updateBudget}
            />

            <label>Allocated Amount</label>
            <input
              type="number"
              id="allocated_amount"
              value={editedBudget.allocated_amount || ''}
              onChange={updateBudget}
            />

            <label>Days Left</label>
            <input
              type="number"
              id="days_left"
              value={editedBudget.days_left || ''}
              onChange={updateBudget}
            />

            <select id="myCategories" onChange={updateCategories}>
              <option value="">Choose Budget Category to Edit</option>
              {categories.map((eachCategory) => (
                <option key={eachCategory.id} value={eachCategory.id}>
                  {eachCategory.category_description}
                </option>
              ))}
            </select>

            <button type="button" onClick={handleEdit}>
              Save Changes
            </button>
          </article>
        </fieldset>
      )}

      {isEdited && successfulBudget && (
        <div className="success-message">
          <h2>Successfully Edited Budget: {successfulBudget.budget_name}</h2>
          <ul>
            <li>Budget Name: {successfulBudget.budget_name}</li>
            <li>Allocated Amount: {successfulBudget.allocated_amount}</li>
            <li>Days Left: {successfulBudget.days_left}</li>
            <li>
              Category:{' '}
              {
                categories.find((c) => c.id === parseInt(successfulBudget.categoryId))
                  ?.category_description || 'Unknown'
              }
            </li>
            <li>Remaining Balance: {successfulBudget.remaining_balance}</li>
          </ul>
        </div>
      )}

      {cantCompleteAlert && (
        <p>
          Your transaction cannot be completed. Your spent amount{' '}
          {editedBudget.spent_amount} would exceed your allocated amount{' '}
          {editedBudget.allocated_amount}. Please try again and raise your allocated amount by at
          least {editedBudget.spent_amount - editedBudget.allocated_amount} to successfully update
          your budget.
        </p>
      )}
    </>
  );
};