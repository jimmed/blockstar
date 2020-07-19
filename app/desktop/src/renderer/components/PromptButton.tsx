import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  AlertTitle,
  Button,
  ButtonProps,
  useDisclosure,
  Text,
} from "@chakra-ui/core";
import { ApolloError } from "apollo-client";
import React, { FC, ReactNode, useCallback, useRef, useState } from "react";

interface PromptButtonProps extends ButtonProps {
  onAccept(): any | Promise<any>;
  actionLabel: ReactNode;
  promptLabel: ReactNode;
  headerLabel: ReactNode;
}

export const PromptButton: FC<PromptButtonProps> = ({
  onAccept,
  actionLabel,
  promptLabel,
  headerLabel,
  children,
  ...buttonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState<ApolloError | null>();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const handleAccept = useCallback(async () => {
    setError(null);
    try {
      await onAccept();
      onClose();
    } catch (error) {
      setError(error);
    }
  }, [onAccept, onClose]);

  return (
    <>
      <Button ref={btnRef} onClick={onOpen} {...buttonProps}>
        {children}
      </Button>
      {isOpen && (
        <AlertDialog
          leastDestructiveRef={cancelRef}
          finalFocusRef={btnRef}
          onClose={onClose}
          isOpen={true}
        >
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader color="gray.200">
              {headerLabel}
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody bg="gray.700">
              <Text color="gray.200">{promptLabel}</Text>
              {error && (
                <Alert status="error" mt={2}>
                  <AlertIcon />
                  <AlertTitle>Error:</AlertTitle>
                  <AlertDescription ml={1}>
                    {error.graphQLErrors?.[0]?.message ?? error.message}
                  </AlertDescription>
                </Alert>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button variant="outline" ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button variantColor="red" ml={3} onClick={handleAccept}>
                {actionLabel}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
