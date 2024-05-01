import Header from "./Header";
import Domain from "./Domain";
import DomainsList from "./DomainsList";

import { abi } from "./contract/DomainABI";
import config from "./config";

import { Box, Flex, useToast } from "@chakra-ui/react";
import { useConnect, useAccount, useBalance, useWriteContract } from "wagmi";

import { readContract, waitForTransactionReceipt, injected } from "@wagmi/core";
import { useState, useEffect, useCallback } from "react";

export default function App() {
  const account = useAccount();
  const balanceData = useBalance(account.address);
  const { connect, status: connectStatus } = useConnect();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const [domains, setDomains] = useState([]);

  const isLoading = connectStatus === "pending";
  const isConnected = account.status === "connected";
  const domainContractAddr = process.env.REACT_APP_DOMAIN_CONTRACT_ADDRESS;

  const toast = useToast({
    position: "bottom-center",
    isClosable: true,
    duration: 3000,
  });

  const showToast = useCallback((title, error, type) => {
    toast({
      title: title,
      description: error.message,
      status: type,
    });
  }, [toast]);

  const fetchDomains = useCallback(async () => {
    try {
      const counter = await readContract(config, {
        abi,
        address: domainContractAddr,
        functionName: "latestID"
      });

      let getDomainsPromises = [];
      for (let i = 1; i <= counter; i++) {
        getDomainsPromises.push(
          readContract(config, {
            abi,
            address: domainContractAddr,
            functionName: "getDomainById",
            args: [i],
          })
        );
      }

      Promise.all(getDomainsPromises).then((domains) => {
        setDomains(domains);
      });
    } catch (error) {
      showToast("Error!", error, 'error');
    }
  }, [domainContractAddr, setDomains, showToast]);

  // Refresh the domains list after the transaction is confirmed
  useEffect(() => {
    const receiptRefresh = async () => {
      const receipt = await waitForTransactionReceipt(hash);
      if (receipt.status === 1) {
        showToast("Success!", "Transaction confirmed", 'success');
        fetchDomains();
      }
    }

    if (hash) receiptRefresh();
  }, [fetchDomains, showToast, hash]);

  // Fetch the data about the domains on page load
  useEffect(() => fetchDomains(), [fetchDomains]);

  const handleConnect = () => {
    try {
      if (!isConnected) connect({ connector: injected() });
    } catch (error) {
      showToast("Error!", error, 'error');
    }
  };

  const handleBuyDomain = async (data) => {
    const splittedDomain = data.domainName.split(".");
    try {
      writeContract({
        abi,
        address: domainContractAddr,
        functionName: "claim",
        args: [splittedDomain[0], splittedDomain[1]],
        value: data.price,
      });
    } catch (error) {
      showToast("Error!", error, 'error');
    }
  }

  return (
    <>
      <Header
        address={account.address}
        balance={balanceData.balance}
        isLoading={isLoading}
        isConnected={isConnected}
        onConnectHandler={handleConnect}
      />
      <Flex flexWrap="wrap" justifyContent="space-between">
        <Box flex="1 1 50%" maxW="50%">
          <Domain
            onBuyHandler={handleBuyDomain}
            isLoading={isPending}
          />
        </Box>
        <Box flex="1 1 50%" maxW="50%">
          <DomainsList domains={domains} />
        </Box>
      </Flex>
    </>
  );
}
