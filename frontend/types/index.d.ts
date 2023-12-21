/**********************************************************
                          Native Coins
***********************************************************/
interface NativeCoin {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
}

/**********************************************************
                          ERC20 Tokens
***********************************************************/

interface EvmToken {
  token_address: string;
  name: string;
  symbol: string;
  logo: string;
  thumbnail: string;
  decimals: string;
  balance: string;
  possible_spam: bool;
  verified_collection: bool;
}

interface TokenData extends EvmToken {
  amount: string;
  address: string;
}

/**********************************************************
                        Collections
***********************************************************/

interface Collection {
  contract_type: string;
  name: string;
  possible_spam: boolean;
  symbol: string;
  token_address: string;
  verified_collection: boolean;
}

interface CollectionExtended extends Collection {
  image?: string;
  nfts: Nft[];
  total: number;
}

type Collections = CollectionExtended[];

type CollectionsMap = {
  [tokenAddress: string]: CollectionExtended;
};

/**********************************************************
                           NFTs
***********************************************************/

interface EvmNft {
  amount?: string | undefined;
  block_number: string;
  block_number_minted: string;
  contract_type: string;
  last_metadata_sync: string;
  last_token_uri_sync: string;
  metadata?: string | undefined;
  name: string;
  normalized_metadata?: NormalizedMetadata;
  owner_of: string;
  possible_spam: boolean;
  symbol: string;
  token_address: string;
  token_hash: string;
  token_id: string;
  token_uri?: string | undefined;
  verified_collection?: boolean | undefined;
}

type NormalizedMetadata =
  | {
      animation_url?: string | undefined;
      attributes?: any[];
      description?: string | undefined;
      external_link?: string | undefined;
      image?: string | undefined;
      name?: string | undefined;
    }
  | undefined;

interface Nft extends EvmNft {
  image: string;
}

interface NftData extends EvmNft {
  amount: string;
}

interface BundleArrays {
  addressesArray: `0x${string}`[];
  numbersArray: bigint[];
}

/**********************************************************
                           Divers
***********************************************************/

interface AddEthereumChainParameter {
  chainId: string;
  chainName?: string;
  nativeCurrency?: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: number;
  };
  rpcUrls?: (string | undefined)[];
  blockExplorerUrls?: (string | undefined)[];
  iconUrls?: string[];
}

interface Receipt {
  success: boolean;
  data: any;
  error: string | null;
}

interface EventData {
  addresses: string[];
  numbers: bigint[];
  owner: string;
  tokenId: bigint;
}

type Steps = "select" | "mint" | "success";

/**********************************************************
                           APIs
***********************************************************/

interface CollectionsResponse {
  data: Collections;
}

interface TokenResponse {
  data: EvmToken[];
}

interface NFTResponse {
  data: Nft[];
}

interface MetadataResponse {
  data: {
    tokensMetadata: TokenData[];
    nftsMetadata: EvmNft[];
  };
}

/**********************************************************
                      Unpacked Assets
***********************************************************/

interface AssetDetail {
  address: string;
  amount: string;
  name?: string;
  type?: "native" | "ERC20" | "ERC721" | "ERC1155";
  tokenId?: string;
}

interface CategorizedAssets {
  native: AssetDetail;
  ERC20: Record<number, AssetDetail>;
  ERC721: Record<number, AssetDetail>;
  ERC1155: Record<number, AssetDetail>;
}
