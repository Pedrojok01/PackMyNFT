import { type ReactNode, useCallback } from "react";

import { useToast } from "@chakra-ui/react";

interface NotifyProps {
  title: string;
  message: ReactNode;
}
type NotificationType = "success" | "error";

export const useNotify = () => {
  const toast = useToast();

  const openNotification = (type: NotificationType, title: string, message: string | ReactNode) => {
    if (type === "success") {
      notifySuccess({ title, message });
    }
    if (type === "error") {
      notifyError({ title, message });
    }
  };

  const notifySuccess = useCallback(
    ({ title, message }: NotifyProps) => {
      toast({
        title,
        description: message,
        position: "top-right",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    [toast],
  );

  const notifyError = useCallback(
    ({ title, message }: NotifyProps) => {
      toast({
        title,
        description: message,
        position: "top-right",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    [toast],
  );

  return {
    notifySuccess,
    notifyError,
    openNotification,
  };
};
