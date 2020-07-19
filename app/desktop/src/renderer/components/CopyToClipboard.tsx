import React, { FC } from "react";
import { ButtonProps, useClipboard, Button, Tooltip } from "@chakra-ui/core";

export const CopyToClipboard: FC<
  ButtonProps & { value?: string | null; showValueInTooltip?: boolean }
> = ({ value, showValueInTooltip, ...props }) => {
  const { onCopy, hasCopied } = useClipboard(value);
  const label = hasCopied
    ? "Copied to clipboard!"
    : showValueInTooltip
    ? value ?? ""
    : "Copy to clipboard";
  return (
    <Tooltip hasArrow label={label} aria-label={label} placement="bottom">
      <Button isDisabled={!value} onClick={onCopy} {...props} />
    </Tooltip>
  );
};
