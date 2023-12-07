import { ReactNode } from "react";

import { FileSearchOutlined } from "@ant-design/icons";
import { notification } from "antd";

import { getExplorer } from "./getExplorerByChain";

type NotificationType = "success" | "info" | "warning" | "error";

export const openNotification = (
  type: NotificationType,
  title: string,
  message: string | ReactNode,
) => {
  notification[type]({
    message: title,
    description: message,
  });
};

export const notifySuccess = (hash: string, chainId: number) => {
  const link = `${getExplorer(chainId)}tx/${hash}`;
  const title = "Transfer Completed!";
  const msg = (
    <>
      Your NFTs have been successfully transferred!
      <br></br>
      <a href={link} target="_blank" rel="noreferrer noopener">
        View in explorer: &nbsp;
        <FileSearchOutlined style={{ transform: "scale(1.3)", color: "purple" }} />
      </a>
    </>
  );
  openNotification("success", title, msg);
};

export const notifyError = (error: string) => {
  const title = "Oops, something went wrong";
  const msg = `Reason: ${error}`;
  openNotification("error", title, msg);
};
