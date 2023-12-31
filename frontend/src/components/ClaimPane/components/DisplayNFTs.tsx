import type { FC } from "react";

import { Box, Image, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";

import useStore from "@/store/store";

interface DisplayNFTsProps {
  nfts: Nft[];
}

const DisplayNFTs: FC<DisplayNFTsProps> = ({ nfts }) => {
  const { nftToClaim, setNftToClaim } = useStore();

  const bg = useColorModeValue("white", "gray.700");

  return (
    <SimpleGrid columns={{ sm: 2, md: 3 }} spacing={5}>
      {nfts.map((nft) => (
        <Box
          key={nft.token_id}
          p={2}
          borderWidth="4px"
          borderRadius="lg"
          overflow="hidden"
          bg={bg}
          position="relative"
          onClick={() => setNftToClaim(nft)}
          cursor="pointer"
          borderColor={nftToClaim?.token_id === nft.token_id ? "teal.500" : undefined}
        >
          <Image src={nft.image} alt={nft.name} />
          <Box p="4">
            <Box display="flex" alignItems="baseline" justifyContent={"space-between"}>
              <Text
                fontWeight="semibold"
                textTransform="uppercase"
                fontSize="sm"
                letterSpacing="wide"
              >
                {nft.name}
              </Text>
              <Text
                fontWeight="semibold"
                textTransform="uppercase"
                fontSize="sm"
                letterSpacing="wide"
              >
                Id: {nft.token_id}
              </Text>
            </Box>
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default DisplayNFTs;
