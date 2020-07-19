import { Avatar, AvatarProps } from "@chakra-ui/core";
import React, { FC } from "react";
import { FullUserFragment } from "../hooks/graphql/fragment/fullUser";

export const UserAvatar: FC<
  { user?: Partial<FullUserFragment> } & Omit<AvatarProps, "src" | "name">
> = ({ user, ...rest }) => (
  <Avatar
    name={user?.username}
    src={
      user?.avatar &&
      `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    }
    {...rest}
  />
);
