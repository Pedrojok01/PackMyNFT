import { type FC, useCallback } from "react";

import { Input } from "@chakra-ui/react";

import { useWindowSize } from "@/hooks";

interface AmountInputProps {
  value: string;
  balance: string;
  onAmountChange: (value: string, tokenAddress?: string) => void;
}

const PackAmountInput: FC<AmountInputProps> = ({ value, balance, onAmountChange }) => {
  const { isMobile, isTablet, isSmallScreen } = useWindowSize();
  const maxPrecision = 9;

  const formatValue = useCallback(
    (val: string) => {
      if (val === "") return val; // Allow empty input to reset the value

      let num = Number(val);
      if (!isNaN(num)) {
        // Clamp value to the range [0, balance]
        num = Math.max(0, Math.min(num, Number(balance)));

        if (!Number.isInteger(num)) {
          // Limit precision only for non-integer numbers
          num = parseFloat(num.toFixed(maxPrecision));
        }

        // Convert to string with fixed decimal places without scientific notation
        return num.toFixed(maxPrecision).replace(/\.?0+$/, "");
      }
      return val;
    },
    [balance, maxPrecision],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = event.target.value.replace(/[^0-9.]/g, "");
    onAmountChange(sanitizedValue);
  };

  const handleBlur = () => {
    const formattedValue = formatValue(value);
    onAmountChange(formattedValue);
  };

  return (
    <Input
      w={isMobile ? "6rem" : isTablet ? "10rem" : isSmallScreen ? "15rem" : "20rem"}
      value={value}
      onChange={handleInputChange}
      onBlur={handleBlur}
      placeholder="Amount per pack"
    />
  );
};

export default PackAmountInput;
