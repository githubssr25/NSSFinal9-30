import { useState, useEffect } from "react";
import { Modal} from "react-bootstrap";
import { getBudgetsByUserId, enterMoneySpentForBudget  } from "../../services/BudgetService"; 
import "./EnterMoneySpent.css";

export const  EnterMoneySpent = () => {
  const user = JSON.parse(localStorage.getItem("NSSProject_user"));
  const customerId = user?.id;

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

  const prepareBudgetForUpdate = (expandedBudget) => {
    return {
      id: expandedBudget.id,
      userId: expandedBudget.userId, 
      categoryId: expandedBudget.categoryId, 
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

    const budgetToSend = prepareBudgetForUpdate(updatedBudget);

    enterMoneySpentForBudget(budgetToSend).then((data) => {
      if (data && data.id) {
        setNewBudget(data);
        setShowModal(true);
        setYourChosenBudget(data);  
      } 
    });
  };

  const handleCloseModal = () => setShowModal(false);

  const handleBudgetChange = (event) => {
    const budgetId = parseInt(event.target.value, 10);

    const budget = yourBudgets.find(
      (eachBudget) => parseInt(eachBudget.id) === parseInt(budgetId)
    );
    setYourChosenBudget(budget);
  };


  return (
    <section className="enter-money-section">

      <div className="select-budget-container">
        <label>Choose your Budget you want to add money to</label>
        <select id="your-budgets" onChange={(e) => handleBudgetChange(e)}>
          <option value="">Select a Budget</option>
          {yourBudgets.map((eachBudget) => (
            <option key={eachBudget.id} value={eachBudget.id}>
              Budget Name: {eachBudget.budget_name} | Allocated Amount:{" "}
              {eachBudget.allocated_amount} | Spent Amount:{" "}
              {eachBudget.spent_amount} | Remaining Balance:{" "}
              {eachBudget.remaining_balance} | Days Left:{" "}
              {eachBudget.days_left}
            </option>
          ))}
        </select>
      </div>
  
      {/* Enter Money Spent Section */}
      <article className="enter-money-container">
        <h2>Enter Money Spent for this Budget</h2>
        <input
          type="number"
          id="spent_amount"
          placeholder="Enter amount of money spent"
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
  
      {/* Success Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Money Added Successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You have added {enteredMoneySpent} dollars to your budget. Your new
            spent amount is {newBudget.spent_amount} for the budget named{" "}
            {newBudget.budget_name}. You now have{" "}
            {newBudget.remaining_balance} left over the next{" "}
            {newBudget.days_left} days.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleCloseModal}>Close</button>
        </Modal.Footer>
      </Modal>
    </section>
  );
  
}