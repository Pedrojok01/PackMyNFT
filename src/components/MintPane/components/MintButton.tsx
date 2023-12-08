import type { FC } from "react";

import { Button } from "@chakra-ui/react";

interface MintButtonProps {
  onMint: () => void;
}

const MintButton: FC<MintButtonProps> = ({ onMint }) => (
  <Button colorScheme="teal" onClick={onMint}>
    Mint Pack
  </Button>
);

export default MintButton;
