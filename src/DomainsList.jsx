import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { formatEther } from "viem";

export default function DomainsList({ domains }) {
  
  const formatDomain = (domain) => {
    return domain.domain + "." + domain.topDomain;
  };

  const formatPrice = (domain) => {
    return formatEther(domain.price) + " ETH";
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Domain name</Th>
              <Th>Price</Th>
            </Tr>
          </Thead>
          {domains?.map((domain, index) => {
            return (
              <Tbody key={index}>
                <Tr>
                  <Td>{formatDomain(domain)}</Td>
                  <Td>{formatPrice(domain)}</Td>
                </Tr>
              </Tbody>
            );
          })}
        </Table>
      </TableContainer>
    </Box>
  );
}
