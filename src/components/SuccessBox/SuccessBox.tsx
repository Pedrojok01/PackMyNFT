// components/SuccessBox.tsx
import { type FC } from "react";

import { Center, Heading, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
import Confetti from "react-confetti";

import { CustomDivider } from "@/components";
import useStore from "@/store/store";

interface SuccessBoxProps {
  children: React.ReactNode;
}

const SuccessBox: FC<SuccessBoxProps> = ({ children }) => {
  const { reset } = useStore();

  return (
    <>
      <Confetti numberOfPieces={1000} recycle={false} tweenDuration={50000} />
      <Center flexDirection="column">
        <Heading as="h2" size="xl" mb={8}>
          🎉 Congratulations! 🎉
        </Heading>

        {children}

        <Text fontSize="lg">Thank you for using Pack My NFT!</Text>

        <Button colorScheme="teal" onClick={() => reset()} mt={6} mb={0}>
          Start Over
        </Button>

        <CustomDivider />
        <Text>
          <Link
            href={"https://github.com/Pedrojok01/PackMyNFT"}
            target="_blank"
            rel="noreferrer noopener"
          >
            This code is free to use and open source. Leave a ⭐️ on Github if you like it!
          </Link>
        </Text>
      </Center>
    </>
  );
};

export default SuccessBox;
