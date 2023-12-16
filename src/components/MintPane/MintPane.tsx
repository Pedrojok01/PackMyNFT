import { type FC, useEffect } from "react";

import { Flex } from "@chakra-ui/react";
import { useAccount, useNetwork } from "wagmi";

import useStore from "@/store/store";
import styles from "@/styles/mainPane.module.css";

import { AssetSelectionStep, ReviewAndMintStep } from "./components";
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
          {currentStep === 1 && <AssetSelectionStep />}

          {currentStep === 2 && <ReviewAndMintStep />}
        </Flex>
      )}
    </ContentBox>
  );
};

export default MintPane;
