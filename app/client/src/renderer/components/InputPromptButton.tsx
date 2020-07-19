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
  Input,
  InputProps,
  useDisclosure,
} from "@chakra-ui/core";
import { ApolloError } from "apollo-client";
import React, {
  ChangeEventHandler,
  FC,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

interface InputPromptButtonProps extends ButtonProps {
  onAccept(value: string): void | Promise<void>;
  actionLabel: string;
  inputProps?: InputProps;
  validate?(value: string): boolean;
}

export const InputPromptButton: FC<InputPromptButtonProps> = ({
  onAccept,
  actionLabel,
  children,
  inputProps,
  validate,
  ...buttonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState("");
  const [error, setError] = useState<ApolloError | null>();
  const trimmedValue = useMemo(() => value.trim(), [value]);
  const isValid = useMemo(
    () => (validate ? validate(trimmedValue) : !!trimmedValue),
    [validate, trimmedValue]
  );
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => setValue(event.target.value),
    []
  );
  const handleAccept = useCallback(async () => {
    if (!isValid) return;
    setError(null);
    try {
      await onAccept(trimmedValue);
      onClose();
    } catch (error) {
      setError(error);
    }
  }, [onAccept, trimmedValue, isValid, onClose]);

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
            <AlertDialogHeader color="gray.200">{children}</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody bg="gray.700">
              <Input
                color="gray.100"
                type="text"
                value={value}
                onChange={handleChange}
                size="lg"
                isInvalid={!!value && !isValid}
                {...inputProps}
              />
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
              <Button
                isDisabled={!isValid}
                variantColor="blue"
                ml={3}
                onClick={handleAccept}
              >
                {actionLabel}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
