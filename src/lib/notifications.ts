export interface NotificationConfig {
  title: string;
  message: string;
  image?: string;
  actionUrl?: string;
}

/**
 * Send a browser push notification to the user
 * Only works if user has granted permission
 */
export async function sendBrowserNotification(config: NotificationConfig): Promise<boolean> {
  // Check if browser supports notifications
  if (!("Notification" in window)) {
    console.warn("Browser doesn't support notifications");
    return false;
  }

  // Check if permission is granted
  if (Notification.permission !== "granted") {
    console.warn("Notification permission not granted");
    return false;
  }

  try {
    const notification = new Notification(config.title, {
      body: config.message,
      icon: config.image || "/favicon.ico",
      badge: "/favicon.ico",
      tag: "site-notification", // Replaces previous notifications
      requireInteraction: false,
      silent: false,
    });

    // Handle notification click
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      if (config.actionUrl) {
        window.location.href = config.actionUrl;
      }
      notification.close();
    };

    // Auto-close after 10 seconds
    setTimeout(() => notification.close(), 10000);

    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
}

/**
 * Check if user has granted notification permission
 */
export function hasNotificationPermission(): boolean {
  return "Notification" in window && Notification.permission === "granted";
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    return "denied";
  }
  
  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return "denied";
  }
}
