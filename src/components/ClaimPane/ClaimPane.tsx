// components/MainPane.tsx
import { type FC } from "react";

import { Divider, Flex } from "@chakra-ui/react";
import { useAccount } from "wagmi";

import styles from "@/styles/mainPane.module.css";

import {
  Status,
  Address,
  Chain,
  Balance,
  BlockNumber,
  TransferNative,
  SignMessage,
} from "./components";
import { ContentBox, NotConnected } from "..";

const ClaimPane: FC = () => {
  const { isConnected } = useAccount();

  return (
    <ContentBox title="Claim Pack">
      {!isConnected ? (
        <NotConnected />
      ) : (
        <Flex className={styles.content}>
          <Status />

          {isConnected && (
            <>
              <Address />
              <Chain />
              <Balance />
              <BlockNumber />

              <Divider mb={5} />

              <Flex
                w={"100%"}
                display={"flex"}
                justifyContent={"space-around"}
                flexWrap={"wrap"}
                gap={5}
              >
                <SignMessage />
                <TransferNative />
              </Flex>
            </>
          )}
        </Flex>
      )}
    </ContentBox>
  );
};

export default ClaimPane;
