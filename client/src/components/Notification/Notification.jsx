import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace this with the method of retrieving your auth token
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/user/notifications",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        setError("Error fetching notifications.");
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/user/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
      setNotifications(
        notifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError("Error marking notification as read.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.length === 0 ? (
          <li>No notifications</li>
        ) : (
          notifications.map((notification) => (
            <li key={notification._id}>
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
              {!notification.read && (
                <button onClick={() => markAsRead(notification._id)}>
                  Mark as Read
                </button>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Notifications;
