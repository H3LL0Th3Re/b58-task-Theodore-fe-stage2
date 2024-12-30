import React from "react";
import { Box, Input, Text, Center, Icon, Flex } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
function SearchPage(){
  return (
    
    <Box color="white" minH="100vh" p={5}>
        {/* Search Bar */}
        <Center>
            <Flex
            // maxW="600px"
            w="full"
            bg="gray.800"
            borderRadius="full"
            alignItems="center"
            p={2}
            mb={10}
            >
                {/* <Icon as={FaSearch} color="gray.400" ml={4} /> */}
                <IoSearchOutline />
                <Input
                placeholder="Search your friend"
                ml={4}
                _placeholder={{ color: "gray.500" }}
                
                flex="1" // Ensures Input takes up remaining space
                />
            </Flex>
        </Center>

        {/* No Results Message */}
        <Center flexDir="column" mt={20}>
            <Text fontSize="xl" fontWeight="bold">
            Write and search something
            </Text>
            <Text fontSize="md" color="gray.400" mt={2} textAlign="center">
            Try searching for something else or check the spelling of what you
            typed.
            </Text>
        </Center>
    </Box>
    
  );
};

export default SearchPage;
