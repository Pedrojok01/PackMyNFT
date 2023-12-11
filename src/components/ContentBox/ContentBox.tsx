import { type FC, type ReactNode } from "react";

import { Box, Heading, useColorMode } from "@chakra-ui/react";

import styles from "@/styles/mainPane.module.css";

type ContentBoxProps = {
  title: string;
  children?: ReactNode;
};

const ContentBox: FC<ContentBoxProps> = ({ title, children }) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      className={styles.container}
      border={colorMode === "light" ? "none" : "1px solid rgba(152, 161, 192, 0.24)"}
      backgroundColor={colorMode === "light" ? "#fff" : "#1a202c"}
    >
      <Heading as="h2" fontSize={"2rem"} mb={10} className="text-shadow">
        {title}
      </Heading>
      {children}
    </Box>
  );
};

export default ContentBox;
