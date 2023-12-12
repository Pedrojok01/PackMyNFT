import { v4 as uuidv4 } from "uuid";

export function processCollections(collections: Collection[], nfts: EvmNft[]): Collections {
  const collectionsMap = collections.reduce<CollectionsMap>((acc, collection) => {
    acc[collection.token_address.toLowerCase()] = {
      ...collection,
      nfts: [],
      total: 0,
      uuid: uuidv4(),
    };
    return acc;
  }, {});

  nfts.forEach((nft: EvmNft) => {
    const collectionKey = nft.token_address.toLowerCase();
    const collection = collectionsMap[collectionKey];

    if (collection) {
      const nftWithImage: Nft = { ...nft, image: nft.normalized_metadata?.image || "" };
      if (!collection.image && nftWithImage.image) {
        collection.image = nftWithImage.image;
      }
      collection.nfts.push(nftWithImage);
      collection.total += 1;
    }
  });

  return Object.values(collectionsMap);
}
