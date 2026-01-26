import React, { createContext, useCallback, useContext, useState } from "react";
import { Text } from "react-native";
import { Snackbar } from "react-native-paper";
import { Colors } from "../constants/Colors";

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
        return Colors.light.success;
      case "error":
        return Colors.light.error;
      case "info":
        return Colors.light.secondary;
      default:
        return Colors.palette.black;
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
          top: 60,
          position: "absolute",
          left: 0,
          right: 0,
        }}
        wrapperStyle={{
          top: 0,
        }}
        action={{
          label: "Close",
          labelStyle: { color: "white" },
          onPress: () => setVisible(false),
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>{message}</Text>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
