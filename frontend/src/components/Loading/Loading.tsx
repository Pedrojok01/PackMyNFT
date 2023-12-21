import type { FC } from "react";

import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

const Loading: FC = () => {
  return (
    <Center>
      <VStack spacing={4}>
        <Spinner />
        <Text>Fetching data... Please wait.</Text>
      </VStack>
    </Center>
  );
};

export default Loading;
