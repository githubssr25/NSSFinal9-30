export const getNotificationTypes = async () => {
    const response = await fetch("http://localhost:8088/notification_types");
    return response.json();
};

export const getNotifications = async (userId) => {
        const response = await fetch(`http://localhost:8088/notifications?userId=${userId}&_expand=budget`);
        return response.json();
};


export const addNotification = async (newNotification) => {
    const response = await fetch("http://localhost:8088/notifications", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newNotification)
    });

    if (!response.ok) {
        throw new Error("Failed to add notification");
    }

    return response.json();
};

export const editNotification = async (notification) => {
    return fetch("http://localhost:8088/notifications", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(notification),
    }).then((res) => res.json());
};

export const deleteNotification = async (notificationId) => {
    const response = await fetch(`http://localhost:8088/notifications/${notificationId}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete notification");
    }
};
