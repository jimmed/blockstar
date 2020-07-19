import React, { FC } from "react";
import { ButtonProps, useClipboard, Button, Tooltip } from "@chakra-ui/core";

export const CopyToClipboard: FC<
  ButtonProps & {
    value?: string | null;
    showValueInTooltip?: boolean;
    label?: string;
  }
> = ({ value, showValueInTooltip, label, ...props }) => {
  const { onCopy, hasCopied } = useClipboard(value);
  const labelToUse = hasCopied
    ? "Copied to clipboard!"
    : showValueInTooltip
    ? value ?? ""
    : label ?? "Copy to clipboard";
  return (
    <Tooltip
      hasArrow
      label={labelToUse}
      aria-label={labelToUse}
      placement="bottom"
    >
      <Button isDisabled={!value} onClick={onCopy} {...props} />
    </Tooltip>
  );
};
