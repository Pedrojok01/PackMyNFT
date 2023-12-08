import { type FC, useState } from "react";

import { Box, Flex, Heading, useColorMode } from "@chakra-ui/react";

import useStore from "@/store/store";
import styles from "@/styles/mainPane.module.css";

import { AssetSelectionStep, ConfirmationModal, ReviewAndMintStep } from "./components";

const MintPane: FC = () => {
  const { colorMode } = useColorMode();
  const { currentStep, setCurrentStep } = useStore();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleMint = () => {
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setCurrentStep(1);
  };

  return (
    <Box
      className={styles.container}
      border={colorMode === "light" ? "none" : "1px solid rgba(152, 161, 192, 0.24)"}
      backgroundColor={colorMode === "light" ? "#fff" : "#1a202c"}
    >
      <Heading as="h2" fontSize={"2rem"} mb={10} className="text-shadow">
        Mint Packs
      </Heading>

      <Flex className={styles.content}>
        {currentStep === 1 && <AssetSelectionStep />}

        {currentStep === 2 && <ReviewAndMintStep onMint={handleMint} />}

        <ConfirmationModal isOpen={showConfirmation} onClose={handleCloseConfirmation} />
      </Flex>
    </Box>
  );
};

export default MintPane;
