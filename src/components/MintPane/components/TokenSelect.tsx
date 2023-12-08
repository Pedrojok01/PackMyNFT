// TokenSelect.tsx
import type { FC } from "react";

import { Select } from "@chakra-ui/react";
import { formatUnits } from "viem";

interface TokenSelectProps {
  native: NativeCoin;
  tokens: EvmToken[];
  onChange: (asset: EvmToken | NativeCoin) => void;
}

const TokenSelect: FC<TokenSelectProps> = ({ native, tokens, onChange }) => {
  return (
    <Select
      placeholder="Select token"
      onChange={(e) => {
        if (e.target.value === native.symbol) {
          // Handle native coin selection
          onChange(native);
        } else {
          // Handle ERC20 token selection
          const selectedToken = tokens.find((token) => token.symbol === e.target.value);
          if (selectedToken) {
            onChange(selectedToken);
          }
        }
      }}
    >
      <option value={native.symbol}>
        {native.symbol} ({native.formatted})
      </option>
      {tokens.map((token) => {
        if (token.possible_spam) {
          return null;
        }
        const value = formatUnits(BigInt(token.balance), Number(token.decimals));
        return (
          <option key={token.token_address} value={token.symbol}>
            {token.name} ({value})
          </option>
        );
      })}
    </Select>
  );
};

export default TokenSelect;
