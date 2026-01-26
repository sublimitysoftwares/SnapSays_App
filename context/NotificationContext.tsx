import React, { createContext, useCallback, useContext, useState } from "react";
import { Snackbar } from "react-native-paper";

type NotificationType = "success" | "error" | "info";

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("info");

  const showSuccess = useCallback((msg: string) => {
    setMessage(msg);
    setType("success");
    setVisible(true);
  }, []);

  const showError = useCallback((msg: string) => {
    setMessage(msg);
    setType("error");
    setVisible(true);
  }, []);

  const showInfo = useCallback((msg: string) => {
    setMessage(msg);
    setType("info");
    setVisible(true);
  }, []);

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#10b981";
      case "error":
        return "#ef4444";
      case "info":
        return "#6366f1";
      default:
        return "#313131";
    }
  };

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={{
          backgroundColor: getBackgroundColor(),
          marginBottom: 20,
        }}
        action={{
          label: "Close",
          onPress: () => setVisible(false),
        }}
      >
        {message}
      </Snackbar>
    </NotificationContext.Provider>
  );
};
