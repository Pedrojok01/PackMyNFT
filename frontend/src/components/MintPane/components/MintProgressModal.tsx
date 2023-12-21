// components/MintProgressModal.tsx
import React, { type FC } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  CircularProgress,
  Progress,
  useColorModeValue,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepNumber,
  StepIcon,
  StepSeparator,
  Text,
  Center,
} from "@chakra-ui/react";

import useStore from "@/store/store";

interface MintProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  batchProgress: number;
}

const steps = [
  { key: 0, title: "Step 1", description: "Asset Approvals" },
  { key: 1, title: "Step 2", description: "Minting Packs" },
];

const MintProgressModal: FC<MintProgressModalProps> = ({
  isOpen,
  onClose,
  currentStep,
  batchProgress,
}) => {
  const { packCount } = useStore();
  const bgColor = useColorModeValue("var(--background-light)", "var(--background-dark)");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader mb={5}>Minting Progress</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stepper index={currentStep} colorScheme="brand">
            {steps.map((step) => (
              <Step key={step.key}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>

          {steps.map((step) => {
            if (currentStep === step.key) {
              return (
                <Center key={step.key} gap={2}>
                  <Text fontSize="1.3rem">{step.title}: </Text>
                  <Text fontSize="1.2rem" fontWeight={700}>
                    {step.description}
                  </Text>
                </Center>
              );
            }
          })}

          {currentStep === 1 && packCount > 200 && (
            <>
              <Text fontSize="sm" mt={6} mb={2}>
                Minting {batchProgress}% of packs
              </Text>

              <Progress value={batchProgress} colorScheme="brand" />
            </>
          )}

          <Box display="flex" alignItems="center" justifyContent="center" p={8}>
            <CircularProgress isIndeterminate value={batchProgress} color="brand.500" />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MintProgressModal;
