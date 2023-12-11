import type { FC } from "react";

import { Center, Text, VStack } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NotConnected: FC = () => {
  return (
    <Center>
      <VStack spacing={4}>
        <Text>Please, connect your web3 wallet to continue.</Text>
        <ConnectButton />
      </VStack>
    </Center>
  );
};

export default NotConnected;
