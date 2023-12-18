// components/MintSuccessPane.tsx
import { type FC } from "react";

import { Text } from "@chakra-ui/react";

import { SuccessBox } from "@/components";
import useStore from "@/store/store";

const SuccessStep: FC = () => {
  const { packCount } = useStore();

  return (
    <SuccessBox>
      <Text fontSize="lg" mb={2}>
        You have successfully minted {packCount} pack{packCount > 1 ? "s" : ""}.
      </Text>
    </SuccessBox>
  );
};

export default SuccessStep;
