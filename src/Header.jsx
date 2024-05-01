import { Button, Flex, Spacer, VStack, Text } from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";

import { formatEther } from "viem";

export default function Header({
  address,
  balance,
  isLoading,
  isConnected,
  onConnectHandler,
}) {
  const formattedBalance = balance ? formatEther(balance) : 0;

  return (
    <Flex
      w={"100%"}
      h={"50px"}
      padding={4}
      position={"fixed"}
      backgroundColor={"gray.400"}
      zIndex={100}
      alignItems={"center"}
    >
      <Spacer />
      <VStack alignItems={"start"} paddingRight={10}>
        {address && (
          <Text fontSize={"md"} textColor={"black"}>
            Address: {address}
          </Text>
        )}
        {balance && (
          <Text fontSize={"md"} textColor={"black"}>
            Balance: {formattedBalance} ETH
          </Text>
        )}
      </VStack>
      <Button
        size={{ base: "md", md: "md", lg: "md" }}
        leftIcon={<LinkIcon />}
        isLoading={isLoading}
        isDisabled={isConnected}
        onClick={onConnectHandler}
      >
        {isConnected ? "Connected" : "Connect your wallet"}
      </Button>
    </Flex>
  );
}
