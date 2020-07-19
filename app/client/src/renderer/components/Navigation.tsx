import { Flex, FlexProps, PseudoBox } from "@chakra-ui/core";
import React, { FC } from "react";
import { FullUserFragment } from "../hooks/graphql/fragment/fullUser";
import { Logo } from "./Logo";
import { UserAvatar } from "./UserAvatar";

export const Navigation: FC<
  FlexProps & { user?: FullUserFragment; logout(): void }
> = ({ user, logout, ...props }) => (
  <Flex
    direction="row"
    bg="gray.700"
    justifyContent="stretch"
    alignItems="center"
    boxShadow="0px 0px 8px 8px rgba(0,0,0,0.1)"
    {...props}
  >
    <Logo size="lg" />
    <PseudoBox
      p={3}
      flexGrow={0}
      onClick={logout}
      cursor="pointer"
      _hover={{ bg: "gray.600" }}
      transition="background-color ease-in-out .1s"
    >
      <UserAvatar user={user} size="sm" />
    </PseudoBox>
  </Flex>
);
