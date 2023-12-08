/**********************************************************
                          NATIVE Coins
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
  image: string | undefined;
  uuid: string;
  nfts: nft[];
}

type Collections = CollectionExtended[];

/**********************************************************
                           NFTs
***********************************************************/

interface EvmNft {
  amount: string;
  block_number: string;
  block_number_minted: string;
  contract_type: string;
  last_metadata_sync: string;
  last_token_uri_sync: string;
  metadata: string;
  name: string;
  normalized_metadata: NormalizedMetadata;
  owner_of: string;
  possible_spam: boolean;
  symbol: string;
  token_address: string;
  token_hash: string;
  token_id: string;
  token_uri: string;
  verified_collection: boolean;
}

type NormalizedMetadata = {
  animation_url: string | null;
  attributes: any[];
  description: string;
  external_link: string | null;
  image: string;
  name: string;
};

interface Nft extends EvmNft {
  image: string;
}

type Nfts = {
  nfts: EvmNft[];
  total: number;
};

/**********************************************************
                           Wallets
***********************************************************/

interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName?: string;
  nativeCurrency?: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: number;
  };
  rpcUrls?: (string | undefined)[];
  blockExplorerUrls?: (string | undefined)[];
  iconUrls?: string[]; // Currently ignored.
}
