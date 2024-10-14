import { getNotificationTypes, addNotification} from "../../services/notificationService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { differenceInDays, format } from 'date-fns';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { getBudgetsByUserId} from "../../services/BudgetService"; 
import { getNotifications} from "../../services/NotificationService"; 
import { Modal, Button } from 'react-bootstrap';



export const LatestNotifications = () => {
    const currentDate = new Date();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("NSSProject_user"));
    const customerId = user?.id; // This retrieves the customerId if the user is logged in
    const [notificationTypes, setNotificationTypes] = useState([]);  // Categories for the dropdown
    const [yourBudgets, setYourBudgets] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState({});
    const [yourNotifications, setYourNotifications] = useState([]);
    const [notificationsToDisplay, setNotificationsToDisplay] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        getNotificationTypes().then((data) => {
            setNotificationTypes(data);
        });
    }, []);
    
    useEffect(() => {
        getBudgetsByUserId(customerId).then((data) => {
            setYourBudgets(data);
        })
    }, [customerId]);

    useEffect(() => {
        getNotifications(customerId).then((data) => {
            setYourNotifications(data);
        })
    }, [customerId])

    useEffect(() => {
        if(yourNotifications.length >0){
            const latestNotifications = determineLatestNotifications(yourNotifications);
            if(latestNotifications.length > 0){
                setIsModalOpen(true);
            }
            setNotificationsToDisplay(latestNotifications);
        }
    }, [yourNotifications]); // Runs only when yourNotifications is updated
    // this ensures the 2nd use effect only runs when you actually get values for first use effect right above it 


    const determineLatestNotifications = (yourNotifications) => {
        const currentDate = new Date(); // Current date for calculations
    
        const determinedNotifications = yourNotifications.map((eachNotification) => {
            let alertMessage = "";
            let toInclude = false;
    
            const budget = eachNotification.budget || {}; // Handle undefined budgets
            const savingsValue = budget.savingsValue || 0;
            const dateCreated = budget.date_created ? new Date(budget.date_created) : null;
            const dueDate = budget.due_date ? new Date(budget.due_date) : null;
    
            const daysRemaining = dueDate
                ? Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24))
                : null;
    
            const daysSinceCreated = dateCreated
                ? Math.ceil((currentDate - dateCreated) / (1000 * 60 * 60 * 24))
                : null;
    
            const dayDiff = daysRemaining - eachNotification.days_before_due;
    
            // console.log(`Current Date: ${currentDate}`);
            // console.log(`Due Date: ${dueDate}, Days Remaining: ${daysRemaining}`);
            // console.log(`Day Difference: ${dayDiff}`);
            // console.log(`Days Before Due Threshold: ${eachNotification.days_before_due}`);
    
            // **1. Date Reminder Check**
            if (eachNotification.dateReminder) {
                if (
                    eachNotification.days_before_due !== null &&
                    dayDiff <= 0 // Within threshold
                ) {
                    toInclude = true;
                    alertMessage = `Reminder: Your budget "${budget.budget_name}" is due in ${daysRemaining} days.`;
                    // console.log(alertMessage);
                }
            }
            // **2. Balance Threshold Check**
            else if (eachNotification.balanceThreshold) {
                const thresholdPercent = eachNotification.balanceThreshold;
                const actualPercent = Math.ceil((budget.spent_amount / budget.allocated_amount) * 100);
    
                // console.log(
                //     `Threshold Check -> Actual: ${actualPercent}%, Threshold: ${thresholdPercent}%`
                // );
    
                if (actualPercent > thresholdPercent) {
                    toInclude = true;
                    alertMessage = `You have spent more than ${thresholdPercent}% of your "${budget.budget_name}" budget.`;
                    // console.log(alertMessage);
                }
            }
            // **3. Average Spending Check**
            else if (eachNotification.checkAverageSpending && budget.isSavingsGoal) {
                const dailySpendingRate = budget.spent_amount / daysSinceCreated;
                const requiredSavingsRate = savingsValue / (daysSinceCreated + daysRemaining);
                const dailySpendingToHitSavings = budget.remaining_balance / daysRemaining;
    
                // console.log(
                //     `Current rate: ${dailySpendingRate.toFixed(2)}, Required rate: ${requiredSavingsRate.toFixed(
                //         2
                //     )}, Allowed daily spend: ${dailySpendingToHitSavings.toFixed(2)}`
                // );
    
                if (dailySpendingRate > requiredSavingsRate) {
                    toInclude = true;
                    alertMessage = `You are overspending! Your current rate is ${dailySpendingRate.toFixed(
                        2
                    )} per day, but to hit your savings goal, it should be ${requiredSavingsRate.toFixed(
                        2
                    )}. You can only spend ${dailySpendingToHitSavings.toFixed(2)} per day to meet your goal.`;
                    console.log(alertMessage);
                }
            }
                 // **4. Final Over-Budget Check (Default Case)**
        else if (budget.spent_amount >= budget.allocated_amount) {
            const overSpent = budget.spent_amount - budget.allocated_amount;

            toInclude = true;
            alertMessage = `Warning: You have overspent by ${overSpent} on your "${budget.budget_name}" budget.`;
            // console.log(alertMessage);
        }
    
            // **Return Notification Object with Updated Info**
            return {
                ...eachNotification,
                toInclude,
                alertMessage,
            };
        });
    
        // console.log("What is the value of determinedNotifications:", determinedNotifications);
    
        // **Filter Notifications to Include Only Relevant Ones**
        const filteredNotifications = determinedNotifications.filter(
            (eachNotification) => eachNotification.toInclude
        );
    
        // console.log("What is the value of filteredNotifications:", filteredNotifications);
    
        return filteredNotifications;
    };
    
      
    
    

   // NOTTHIS return const finalNotifications = {
      //     ...eachNotification,
      //     toInclude,
      //     alertMessage,
      // };

const toggleModal = () => {
    console.log("Toggling Modal", isModalOpen); // Debugging line
    setIsModalOpen(!isModalOpen);
};



return (
    <Modal show={isModalOpen} onHide={toggleModal}>
        <Modal.Header closeButton>
            <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {notificationsToDisplay.length > 0 ? (
                <>
                    <Button onClick={toggleModal}>
                        {isModalOpen ? 'Hide Notifications' : 'Show Notifications'}
                    </Button>

                    {isModalOpen && (
                        <div className="notification-list">
                            {notificationsToDisplay.map((notif) => (
                                <div key={notif.id} className="notification-item">
                                    <span>{notif.message}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <p>No new notifications</p>
            )}
        </Modal.Body>
    </Modal>
);
};

 // <nav>
    //     <div className="navBar">
    //         <div className="notification-dropdown">
    //             <span> Notification </span>
    //             <div className="dropdown-content">
    //                 { !isModalOpen ? (
    //                 ) : isModalOpen && notificationsToDisplay.length > 0 ? (
    //                     <div className="notification-list">
    //                         {notificationsToDisplay.map((notif) => (
    //                             <div key={notif.id} className="notification-item">
    //                             <p> {notif.message}</p>
    //                           </div>
    //                         ))}
    //                     </div>
    //                 <button> Click to Toggle Notification </button>
    //             ) : (
    //                 <p> No New Notifications </p>
    //             )}

    //             </div>
    //         </div>
    //     </div>
    // </nav>
