import { type FC, useState } from "react";

import { FormErrorMessage, Input } from "@chakra-ui/react";

import { useWindowSize } from "@/hooks";

interface AmountInputProps {
  value: number | string | undefined;
  onChange: (value: number, tokenAddress?: string) => void;
}

const PackAmountInput: FC<AmountInputProps> = ({ value, onChange }) => {
  const { isMobile, isTablet, isSmallScreen } = useWindowSize();

  const [hasError, setHasError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value ? Number(e.target.value) : "";
    setHasError(!e.target.value || Number(amount) <= 0);
    onChange(Number(amount));
  };

  return (
    <>
      <Input
        w={isMobile ? "6rem" : isTablet ? "10rem" : isSmallScreen ? "15rem" : "20rem"}
        type="number"
        value={value}
        onChange={handleChange}
        placeholder="Amount per pack"
      />
      {hasError && <FormErrorMessage>Invalid Amount</FormErrorMessage>}
    </>
  );
};

export default PackAmountInput;
