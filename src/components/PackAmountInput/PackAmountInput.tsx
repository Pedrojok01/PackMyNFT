import type { FC } from "react";

import { Input } from "@chakra-ui/react";

import { useWindowSize } from "@/hooks";

interface AmountInputProps {
  value: number | string | undefined;
  onChange: (value: number, tokenAddress?: string) => void;
}

const PackAmountInput: FC<AmountInputProps> = ({ value, onChange }) => {
  const { isTablet, isSmallScreen } = useWindowSize();

  return (
    <Input
      w={isTablet ? 40 : isSmallScreen ? 60 : 80}
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder="Amount per pack"
    />
  );
};

export default PackAmountInput;
