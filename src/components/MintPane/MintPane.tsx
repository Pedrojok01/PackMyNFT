import { type FC, useState, useEffect } from "react";

import { Flex } from "@chakra-ui/react";
import { useAccount, useNetwork } from "wagmi";

import useStore from "@/store/store";
import styles from "@/styles/mainPane.module.css";

import { AssetSelectionStep, ConfirmationModal, ReviewAndMintStep } from "./components";
import { ContentBox, NotConnected } from "..";

const MintPane: FC = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { currentStep, setCurrentStep, reset } = useStore();
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    reset();
  }, [chain, reset]);

  const handleMint = () => {
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setCurrentStep(1);
  };

  return (
    <ContentBox title="Mint Packs">
      {!isConnected ? (
        <NotConnected />
      ) : (
        <Flex className={styles.content}>
          {currentStep === 1 && <AssetSelectionStep />}

          {currentStep === 2 && <ReviewAndMintStep onMint={handleMint} />}

          <ConfirmationModal isOpen={showConfirmation} onClose={handleCloseConfirmation} />
        </Flex>
      )}
    </ContentBox>
  );
};

export default MintPane;
