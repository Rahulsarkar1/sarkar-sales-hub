import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationPopupProps {
  enabled: boolean;
  title?: string;
  message?: string;
}

export default function NotificationPermissionPopup({ 
  enabled, 
  title = "Stay updated!", 
  message = "Allow notifications for latest updates and offers." 
}: NotificationPopupProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [activityDetected, setActivityDetected] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    
    // Check if browser supports notifications
    if (!("Notification" in window)) return;
    
    // Check if already responded or in cooldown
    const dismissedUntil = localStorage.getItem('notification_popup_dismissed_until');
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil)) return;
    
    const existingPermission = localStorage.getItem('notification_permission_response');
    if (existingPermission === 'granted' || existingPermission === 'denied') return;

    // Track user activity
    const handleActivity = () => setActivityDetected(true);
    
    window.addEventListener('mousemove', handleActivity, { once: true });
    window.addEventListener('click', handleActivity, { once: true });
    window.addEventListener('scroll', handleActivity, { once: true });
    window.addEventListener('touchstart', handleActivity, { once: true });

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [enabled]);

  useEffect(() => {
    if (!activityDetected) return;
    
    // Show popup after 10 seconds of activity
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [activityDetected]);

  const handleAllow = async () => {
    try {
      const permission = await Notification.requestPermission();
      localStorage.setItem('notification_permission_response', permission);
      setShowPopup(false);
    } catch (error) {
      console.error('Notification permission error:', error);
    }
  };

  const handleDismiss = () => {
    const sevenDaysFromNow = Date.now() + (7 * 24 * 60 * 60 * 1000);
    localStorage.setItem('notification_popup_dismissed_until', sevenDaysFromNow.toString());
    localStorage.setItem('notification_permission_response', 'denied');
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 md:bottom-6 z-50 animate-fade-in">
      <div className="max-w-md w-[calc(100vw-2rem)] bg-card border border-border rounded-xl shadow-2xl p-4 md:p-6 space-y-3 md:space-y-4">
        <div className="flex items-start gap-2 md:gap-3">
          <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm md:text-base mb-0.5 md:mb-1">{title}</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-snug">
              {message}
            </p>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleAllow} 
            className="flex-1 text-xs md:text-sm"
            size="sm"
          >
            Allow
          </Button>
          <Button 
            onClick={handleDismiss} 
            variant="outline" 
            className="flex-1 text-xs md:text-sm"
            size="sm"
          >
            No, thanks
          </Button>
        </div>
      </div>
    </div>
  );
}
