import type { NextPage } from "next";
import { Box, Button, Container, Flex, Input, SimpleGrid, Stack, Text, Image } from "@chakra-ui/react";
import { MediaRenderer, Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { HERO_IMAGE_URL, LOTTERY_CONTRACT_ADDRESS } from "../const/addresses";
import LotteryStatus from "../components/Status";
import { ethers } from "ethers";
import PrizeNFT from "../components/PrizeNFT";
import { useState } from "react";
import CurrentEntries from "../components/CurrentEntries";

const Home: NextPage = () => {
  const address = useAddress();

  const {
    contract
  } = useContract(LOTTERY_CONTRACT_ADDRESS);

  const {
    data: lotteryStatus
  } = useContractRead(contract, "lotteryStatus");

  const {
    data: ticketCost,
    isLoading: ticketCostLoading
  } = useContractRead(contract, "ticketCost");
  const ticketCostInEther = ticketCost ? ethers.utils.formatEther(ticketCost) : "0";

  const {
    data: totalEntries,
    isLoading: totalEntriesLoading
  } = useContractRead(contract, "totalEntries");

  const [ticketAmount, setTicketAmount] = useState(1);
  const ticketCostSubmit = parseFloat(ticketCostInEther) * ticketAmount;

  function increaseTicketAmount() {
    setTicketAmount(ticketAmount + 1);
  }

  function decreaseTicketAmount() {
    if (ticketAmount > 1) {
      setTicketAmount(ticketAmount - 1);
    }
  }

  return (
    <Flex direction="column" position="relative">
      <Image
        src="https://static.wixstatic.com/media/1808ae_d7e2677e53784c8eba07a386e424d352~mv2.png"
        alt="Logo"
        boxSize="125px"
        position="absolute"
        zIndex="2"
        top="-75px"
        left="190px"
      />
      <Container maxW={"1440px"}>
        <SimpleGrid columns={2} spacing={4} minH={"60vh"}>
          <Flex justifyContent={"center"} alignItems={"center"}>
            {lotteryStatus ? (
              <PrizeNFT />
            ) : (
              <MediaRenderer
                src={HERO_IMAGE_URL}
                width="100%"
                height="100%"
              />
            )}
          </Flex>
          <Flex justifyContent={"center"} alignItems={"center"} p={"5%"}>
            <Stack spacing={10}>
              <Box>
                <Text fontSize={"xl"}>Gods Of Gaming Raffle dApp</Text>
                <Text fontSize={"4xl"} fontWeight={"bold"}>Buy a ticket to win the NFT Prize!</Text>
              </Box>
              
              <Text fontSize={"xl"}>Buy entries for a chance to win the NFT! Winner will be selected and transferred the NFT. The more entries the higher chance you have of winning the prize.</Text>
              
              <LotteryStatus status={lotteryStatus}/>
              {!ticketCostLoading && (
                <Text fontSize={"2xl"} fontWeight={"bold"}>Cost Per Ticket: {ticketCostInEther} BNB</Text>
              )}
              {address ? (
                <Flex flexDirection={"row"}>
                  <Flex flexDirection={"row"} w={"25%"} mr={"40px"}>
  <Button onClick={decreaseTicketAmount}>-</Button>
  <Input
  value={ticketAmount}
  type="number" // Change the type to "number"
  onChange={(e) => setTicketAmount(parseInt(e.target.value))}
  textAlign="center"
  mx={2}
  style={{ color: "black" }}
/>
  <Button onClick={increaseTicketAmount}>+</Button>
</Flex>
                  
                  <Web3Button
  contractAddress={LOTTERY_CONTRACT_ADDRESS}
  action={(contract) =>
    contract.call(
      "buyTicket",
      [ticketAmount],
      {
        value: ethers.utils.parseEther(ticketCostSubmit.toString()),
      }
    )
  }
  isDisabled={!lotteryStatus}
  style={{ color: "black" }} // Add this style property
>
  Buy Ticket(s)
</Web3Button>
                </Flex>
              ) : (
                <Text>Connect wallet to buy ticket.</Text>
              )}
              {!totalEntriesLoading && (
                <Text>Total Entries: {totalEntries.toString()}</Text>
              )}
            </Stack>
          </Flex>
        </SimpleGrid>
        <Stack mt={"40px"} textAlign={"center"}>
          <Text fontSize={"xl"}>Current Raffle Participants:</Text>
          <CurrentEntries/>
        </Stack>
      </Container>
    </Flex>
  );
};

export default Home;
