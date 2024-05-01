import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { parseEther } from "viem";

export default function Domain({ onBuyHandler, isLoading }) {
  const [formData, setFormData] = useState({
    domainName: "",
    price: 0,
  });

  const toast = useToast({
    position: "bottom-center",
    isClosable: true,
    duration: 3000,
  });

  const handleBuyDomain = (e) => {
    e.preventDefault();

    if (formData.domainName === "") {
      toast({
        title: "Domain name is required",
        description: "Please enter the domain name",
        status: "error",
      });
      return;
    }

    if (formData.price === 0) {
      toast({
        title: "Price is required",
        description: "Please enter the price",
        status: "error",
      });
      return;
    }

    onBuyHandler({...formData, price: parseEther(formData.price)});
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <form onSubmit={handleBuyDomain}>
        <VStack
          padding={10}
          spacing={10}
          width="full"
          maxWidth="md"
          backgroundColor="gray.100"
        >
          <FormControl>
            <FormLabel>Enter domain you want to buy</FormLabel>
            <Input
              type="text"
              placeholder="vitalik.eth"
              backgroundColor={"white"}
              onChange={(e) => {
                setFormData({ ...formData, domainName: e.target.value });
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Enter the amount you want to send</FormLabel>
            <Input
              placeholder="1 ETH"
              backgroundColor={"white"}
              onChange={(e) => {
                setFormData({ ...formData, price: e.target.value });
              }}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            minWidth={200}
            type="submit"
            isLoading={isLoading}
          >
            Buy the domain
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
