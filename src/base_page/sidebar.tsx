import React from 'react';
import { Box, VStack, Heading, Button, Text, Flex} from '@chakra-ui/react';
import { Avatar } from "@/components/ui/avatar"
import { FaHome, FaSearch, FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import {
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { useState } from "react"
import { Input } from "@chakra-ui/react"
function Sidebar() {
    const [open, setOpen] = useState(false)
    return (
        <Box
            color="white"
            width="280px"
            height="100vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            py={5}
        >
            {/* Logo */}
            {/* <Heading as="h1" fontSize="4x2" color="green.600" mb={1}>
                Circle
            </Heading> */}

            <div className="sidebar">
                <Heading as="h1" fontSize="4x2" color="green.600" mb={1}>
                    Circle
                </Heading>
                <ul>
                    <li>
                        <a href="/main"><FaHome /> Home</a>
                    </li>
                    <li>
                        <a href="/main/search"><FaSearch /> Search</a>
                    </li>
                    <li>
                        <a href="/main/follow"><FaHeart /> Follows</a>
                    </li>
                    <li>
                        <a href="/main/profile-detail"> <FaUser /> Profile</a>
                    </li>
                </ul>
                

                <PopoverRoot>
                    <PopoverTrigger asChild>
                        <Button size="sm" variant="outline" bg="green.700" borderRadius="2xl">
                            Create Post
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent bg="gray.900" color="white" borderRadius="lg" w="400px" p="4">
                        <PopoverArrow bg="gray.900" />
                        <PopoverBody>
                        {/* Header Section */}
                        <Flex align="center" mb="4">
                            <Avatar
                            size="sm"
                            name="User Avatar"
                            src="https://tse2.mm.bing.net/th?id=OIP.Rgx2IZ1FbVbB8vWUCJPLsAHaEK&pid=Api&P=0&h=180"
                            />
                            <Input variant="flushed" placeholder='What is happening?!'/>
                        </Flex>

                        {/* Divider Replacement */}
                        <Box h="1px" bg="gray.600" mb="4" />

                        {/* Footer Section */}
                        <Flex align="center" justify="space-between">
                            <Button
                            size="sm"
                            variant="ghost"
                            colorScheme="green"
                            display="flex"
                            alignItems="center"
                            gap="2"
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                width="16"
                                height="16"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5.25v13.5M5.25 12h13.5"
                                />
                            </svg>
                                Add Image
                            </Button>
                            <Button size="sm" colorScheme="green">
                                Post
                            </Button>
                        </Flex>
                        </PopoverBody>
                    </PopoverContent>
                    </PopoverRoot>

                <div className="logout">
                    <form><FaSignOutAlt /> Logout</form>
                </div>
            </div>
            
        </Box>
        
    );
}

export default Sidebar;
