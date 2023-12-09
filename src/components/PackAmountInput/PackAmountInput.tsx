import { type FC } from "react";

import { Input } from "@chakra-ui/react";

import { useWindowSize } from "@/hooks";

interface AmountInputProps {
  value: number | string | undefined;
  balance: string;
  onChange: (value: number, tokenAddress?: string) => void;
}

const PackAmountInput: FC<AmountInputProps> = ({ value, balance, onChange }) => {
  const { isMobile, isTablet, isSmallScreen } = useWindowSize();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAmount = Number(e.target.value);
    const maxAmount = Number(balance);

    if (isNaN(inputAmount) || inputAmount < 0) {
      onChange(0);
      return;
    }
    if (inputAmount > maxAmount) {
      onChange(maxAmount);
      return;
    }

    onChange(inputAmount);
  };

  return (
    <Input
      w={isMobile ? "6rem" : isTablet ? "10rem" : isSmallScreen ? "15rem" : "20rem"}
      type="number"
      value={value}
      onChange={handleChange}
      placeholder="Amount per pack"
    />
  );
};

export default PackAmountInput;
