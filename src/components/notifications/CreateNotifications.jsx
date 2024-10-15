import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBudgetsByUserId } from "../../services/BudgetService"; 
import { getNotificationTypes, addNotification } from "../../services/NotificationService"; 
// import "./CreateNotification.css";

export const CreateNotifications = () => {
    const user = JSON.parse(localStorage.getItem("NSSProject_user"));
    const customerId = user?.id;
  
    const [budgets, setBudgets] = useState([]);
    const [notificationTypes, setNotificationTypes] = useState([]);
    const [selectedBudgetId, setSelectedBudgetId] = useState("");
    const [notificationTypeId, setNotificationTypeId] = useState("");
    const [newNotification, setNewNotification] = useState({
      message: "",
      balanceThreshold: null,
      daysBeforeDue: null,
      dueDate: "",
      checkAverageSpending: false,
      progress: null,
    });
    const [successfulAddition, setSuccessfulAddition] = useState(false);
    const [lastNotification, setLastNotification] = useState(null); // Store latest notification
  
    const navigate = useNavigate();

    useEffect(() => {
        getBudgetsByUserId(customerId).then(setBudgets);
        getNotificationTypes().then(setNotificationTypes);
      }, [customerId]);


const handleBudgetChange = (event) => {
    // console.log(event.target.id);    // Logs "budgetSelect" FROM select id="budgetSelect" 
    // console.log(event.target.value); // Logs the selected budget ID (e.g., "2")
    // event.target.id refers to the id attribute of the HTML element that triggered the event.
    setSelectedBudgetId(event.target.value);

}

const handleTypeChange = (event) => {
    setNotificationTypeId(event.target.value);
  };

  const handleInputChange = (event) => {
    const {id, value} = event.target;
    // const id = event.target.id
    //  const value = event.target.value
setNewNotification( (prev) => ({...prev, [id] : value}));
}

//event.target refers to the <select> element (not an individual option).
//The value in event.target.value is the value of the selected <option>.


const handleSubmit = async(event) => {

    event.preventDefault();


event.preventDefault();

const notificationToSend = {
    ...newNotification,
    userId: customerId,
    budgetId: selectedBudgetId,
    notification_type_id: parseInt(notificationTypeId, 10),
    is_read: false,
}


const response = await addNotification(notificationToSend);
setLastNotification(notificationToSend); // Store latest notification
setSuccessfulAddition(true);
console.log("Notification added successfully", response);

   // Reset form after submission
   setNewNotification({
    message: "",
    balanceThreshold: null,
    daysBeforeDue: null,
    dueDate: "",
    checkAverageSpending: false,
    progress: null,
  });
  setSelectedBudgetId("");
  setNotificationTypeId("");
};

return (
  <main>
    <form className="flex-form" onSubmit={handleSubmit}>
      <h2> Create New Notification </h2>
      <label>Select a Budget</label>
      <select
        id="budgetSelect"
        value={selectedBudgetId}
        onChange={handleBudgetChange}
        required
      >
        <option value="">Choose Budget</option>
        {budgets.map((budget) => (
          <option key={budget.id} value={budget.id}>
            {budget.budget_name}
          </option>
        ))}
      </select>

      {/* Select Notification Type */}
      <label>Select Notification Type</label>
      <select value={notificationTypeId} onChange={handleTypeChange} required>
        <option value="">Choose Notification Type</option>
        {notificationTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.description}
          </option>
        ))}
      </select>

      {/* Conditional Inputs */}
      {notificationTypeId === "1" && (
        <>
          <label>Due Date</label>
          <input
            type="date"
            id="dueDate"
            onChange={handleInputChange}
            required
          />

          <label>Days Before Due</label>
          <input
            type="number"
            id="daysBeforeDue" // need this for event.target.id IMPORTANT
            placeholder="Days Before Due"
            onChange={handleInputChange}
          />
        </>
      )}

      {notificationTypeId === "2" && (
        <>
          <label>Balance Threshold (%)</label>
          <input
            type="number"
            id="balanceThreshold"
            placeholder="Enter Threshold"
            onChange={handleInputChange}
          />
        </>
      )}

      {notificationTypeId === "3" && (
        <>
          <label>Target Daily Spending</label>
          <input
            type="number"
            id="averageSpending"
            placeholder="Enter Target Spending"
            onChange={handleInputChange}
          />
        </>
      )}

      {notificationTypeId === "5" && (
        <>
          <label>Goal Progress (%)</label>
          <select id="progress" onChange={handleInputChange} required>
            <option value="">Select Progress Level</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
          </select>
        </>
      )}

      {/* Custom Message */}
      <label>Message</label>
      <input
        type="text"
        id="message"
        placeholder="Enter your message"
        onChange={handleInputChange}
        required
      />

      <button type="submit"> Create Notification </button>
    </form>
    {successfulAddition && lastNotification && (
        <table>
          <thead>
            <tr>
              <th>Message</th>
              <th>Due Date</th>
              <th>Type of Notification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{lastNotification.message}</td>
              <td>{lastNotification.dueDate || "N/A"}</td>
              <td>
                {
                  notificationTypes.find(
                    (type) =>
                      parseInt(type.id) === lastNotification.notification_type_id
                  )?.description || "Unknown"
                }
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </main>
  );
};



