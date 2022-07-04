import { Store } from "react-notifications-component";

type NotificationType = "success" | "danger" | "info" | "warning" | "default";

export const createNotification = (
  type: NotificationType,
  title?: string,
  message?: string
) => {
  Store.addNotification({
    title,
    message,
    type,
    container: "top-full",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 1500,
    },
  });
};
