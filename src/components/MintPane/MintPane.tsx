import { type FC, useEffect } from "react";

import { Flex } from "@chakra-ui/react";
import { useAccount, useNetwork } from "wagmi";

import useStore from "@/store/store";
import styles from "@/styles/mainPane.module.css";

import { SelectStep, ReviewAndMintStep, SuccessStep } from "./components";
import { ContentBox, NotConnected } from "..";

const MintPane: FC = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { currentStep, reset } = useStore();

  useEffect(() => {
    reset();
  }, [chain, reset]);

  return (
    <ContentBox title="Mint Packs">
      {!isConnected ? (
        <NotConnected />
      ) : (
        <Flex className={styles.content}>
          {currentStep === 1 && <SelectStep />}
          {currentStep === 2 && <ReviewAndMintStep />}
          {currentStep === 3 && <SuccessStep />}
        </Flex>
      )}
    </ContentBox>
  );
};

export default MintPane;
