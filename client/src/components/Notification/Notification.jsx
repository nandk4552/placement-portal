import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Request permission for browser notifications on component mount
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const addNotification = (message, level) => {
    // Check for duplicate messages
    if (
      notifications.find((notification) => notification.message === message)
    ) {
      return;
    }

    // Add to state notifications
    setNotifications([...notifications, { message, level }]);

    // Display browser notification if permission is granted
    if (Notification.permission === "granted") {
      new Notification(message);
    }

    // Display in-browser toast notification
    toast(message, { type: level });
  };

  return (
    <div>
      <ToastContainer />
      <button
        onClick={() => addNotification("New Placement Drive!", "success")}
      >
        Notify Students
      </button>
    </div>
  );
};

export default Notification;
