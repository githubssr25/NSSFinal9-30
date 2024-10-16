import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBudgetsByUserId } from "../../services/BudgetService"; 
import { getNotificationTypes, addNotification, deleteNotification, getNotifications } from "../../services/NotificationService";


export const DeleteNotifications = () => {
 const user = JSON.parse(localStorage.getItem("NSSProject_user"));
 const customerId = user?.id;

const [ourNotifications, setOurNotifications] = useState([]);
const [selectedNotification, setSelectedNotification] = useState({});
const [notificationTypes, setNotificationTypes] = useState([]);
const [isDeleted, setIsDeleted] = useState(false);


useEffect(() => {
    getNotifications(customerId).then((data) => {
        setOurNotifications(data);
    })
}, [customerId])

useEffect(() => {
    getNotificationTypes().then(setNotificationTypes);
  }, [customerId]);

const chosenDelete = (event) => {
  const notificationID = event.target.value;
  const notificationToDelete = ourNotifications.find(
    (eachNotif) => parseInt(eachNotif.id) === parseInt(notificationID)
  );
  setSelectedNotification(notificationToDelete);
};

const handleDelete = async () => {
  if (selectedNotification) {
    try {
      await deleteNotification(selectedNotification.id); // Call the delete service
      setIsDeleted(true); // Set the deleted flag to true
      setOurNotifications((prev) =>
        prev.filter(
          (eachNot) =>
            parseInt(eachNot.id) !== parseInt(selectedNotification.id)
        )
      ); // Remove from the list
      setSelectedNotification(null); // Reset selected notification
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  }
};
    

  return (
    <>
      <label>Select a Notification To Delete</label>
      <select id="notificationToDelete" onChange={chosenDelete}>
        <option value="">Select a Notification</option>
        {ourNotifications.map((eachNotif) => (
          <option key={eachNotif.id} value={eachNotif.id}>
            {eachNotif.message}
          </option>
        ))}
      </select>

      {selectedNotification && (
        <section>
          <header>
            <h2 id="notification-title">Notification Details</h2>
          </header>
          <article>
            <h3>
              {
                notificationTypes.find(
                  (eachType) =>
                    parseInt(eachType.id) ===
                    parseInt(selectedNotification.notification_type_id)
                )?.description || "Unknown notification type"
              }
            </h3>
            <ul>
              <li>
                <strong>Message:</strong> {selectedNotification.message}
              </li>
            </ul>
          </article>
          <button onClick={handleDelete}>Delete Notification</button>
        </section>
      )}

      {isDeleted && (
        <p style={{ color: "green" }}>
          Notification successfully deleted!
        </p>
      )}
    </>
  );
};