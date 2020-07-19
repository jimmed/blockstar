import { Heading, HeadingProps } from "@chakra-ui/core";
import React, { FC } from "react";

export const Logo: FC<HeadingProps> = (props) => (
  <Heading
    color="gray.200"
    flexGrow={1}
    px={6}
    fontWeight="normal"
    letterSpacing={4}
    {...props}
  >
    blockstar
  </Heading>
);
