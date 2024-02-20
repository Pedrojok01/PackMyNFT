import { type FC, useEffect } from "react";

import { Flex } from "@chakra-ui/react";
import { useAccount } from "wagmi";

import { ContentBox, NotConnected } from "@/components";
import useStore from "@/store/store";
import styles from "@/styles/mainPane.module.css";

import { SelectStep, ReviewAndMintStep, SuccessStep } from "./components";

const MintPane: FC = () => {
  const { isConnected, chain } = useAccount();
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
