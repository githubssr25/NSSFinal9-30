import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";


// Assuming you have a function to create a new budget and fetch categories
import { createBudget, getCategories, getBudgetsByUserId, enterMoneySpentForBudget  } from "../../services/BudgetService"; // Adjust path as needed


export const  EnterMoneySpent = () => {
  const user = JSON.parse(localStorage.getItem("NSSProject_user"));
  const customerId = user?.id; // This retrieves the customerId if the user is logged in

  const [yourBudgets, setYourBudgets] = useState([]);
  const [chosenBudget, setYourChosenBudget] = useState({});
  const [enteredMoneySpent, setEnteredMoneySpent] = useState(0);
  const [newBudget, setNewBudget] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getBudgetsByUserId(customerId).then((data) => {
      setYourBudgets(data);
    });
  }, [customerId, newBudget, chosenBudget]);

  //reason for this is becasue we dont want to be sending updated budgets back into DB with exapnded objects
  const prepareBudgetForUpdate = (expandedBudget) => {
    return {
      id: expandedBudget.id,
      userId: expandedBudget.userId, // Keep the userId field
      categoryId: expandedBudget.categoryId, // Keep the categoryId field
      allocated_amount: expandedBudget.allocated_amount,
      spent_amount: expandedBudget.spent_amount,
      remaining_balance: expandedBudget.remaining_balance,
      days_left: expandedBudget.days_left,
      budget_name: expandedBudget.budget_name,
    };
  };

  const submitUpdatedBudget = () => {
    console.log("Current chosenBudget before update:", chosenBudget);
    const updatedBudget = {
      ...chosenBudget,
      spent_amount:
        parseInt(chosenBudget.spent_amount) + parseInt(enteredMoneySpent),
      remaining_balance:
        parseInt(chosenBudget.remaining_balance) - parseInt(enteredMoneySpent),
    };

    const budgetToSend = prepareBudgetForUpdate(updatedBudget); // Convert the budget

    enterMoneySpentForBudget(budgetToSend).then((data) => {
      if (data && data.id) {
        setNewBudget(data);
        setShowModal(true);
        setYourChosenBudget(data);  // This updates chosenBudget with the latest values
        console.log("what is data coming back for setNewBudget", data);
        console.log("money successfully added to budget");
      } else {
        console.log("error: adding money to budget failed");
      }
    });
  };

  const handleCloseModal = () => setShowModal(false); // Sets showModal to false, which hides the modal

  const handleBudgetChange = (event) => {
    const budgetId = parseInt(event.target.value, 10);
    // event.target.value REMEMBER ONLY GIVES YOU THE OBJECT ID SO THE ID OF THE BUDGET ITSELF YOU CANT ST THAT ISELF THAT WONT DO SHIT

    const budget = yourBudgets.find(
      (eachBudget) => parseInt(eachBudget.id) === parseInt(budgetId)
    );
    setYourChosenBudget(budget);
  };

  //if you wanted to incldue category btw this is how you wouldve done it
  //              Category: {eachBudget.category ? eachBudget.category.category_description : 'Unknown'}

  return (
    <section>
      <label> Choose your Budget you want to add money to </label>
      <select id="your-budgets" onChange={(e) => handleBudgetChange(e)}>
        <option value=""> Select a Budget </option>
        {yourBudgets.map((eachBudget) => {
          return (
            <option key={eachBudget.id} value={eachBudget.id}>
              Budget Name: {eachBudget.budget_name}
              Allocated Amount: {eachBudget.allocated_amount}
              Spent Amount: {eachBudget.spent_amount}
              Remaining Balance: {eachBudget.remaining_balance}
              Days Left: {eachBudget.days_left}
            </option>
          );
        })}
      </select>
      <article>
        <h2> Enter Money Spent for this Header </h2>
        <input
          type="number"
          id="spent_amount"
          placeholder="Enter An Amount of Money You Have Spent For This Budget To Update It"
          value={enteredMoneySpent}
          onChange={(e) => setEnteredMoneySpent(e.target.value)}
        />
      </article>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          submitUpdatedBudget();
        }}
      >
        Submit Budget With Updated Money Added To It
      </button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Money Added Successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{newBudget.spent_amount} was added to the spent amount on your budget named {newBudget.budget_name} you now have {newBudget.remaining_balance} left over the {newBudget.days_left} days </p>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleCloseModal}>Close</button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}