// TokenSelect.tsx
import { useMemo, type FC, type ChangeEvent } from "react";

import { Select } from "@chakra-ui/react";
import { formatUnits } from "viem";

import useStore from "@/store/store";

interface TokenSelectProps {
  native: NativeCoin;
  tokens: EvmToken[];
  onChange: (asset: EvmToken | NativeCoin) => void;
}

const TokenSelect: FC<TokenSelectProps> = ({ native, tokens, onChange }) => {
  const { selectedNative, selectedTokens } = useStore();

  const availableTokens = useMemo(
    () =>
      tokens.filter(
        (token) =>
          !selectedTokens.some((selected) => selected.token_address === token.token_address),
      ),
    [tokens, selectedTokens],
  );

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
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
  };

  return (
    <Select placeholder="Select token" onChange={handleSelectChange}>
      {!selectedNative && (
        <option value={native.symbol}>
          {native.symbol} ({native.formatted})
        </option>
      )}
      {availableTokens.map((token) => {
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
