import React, { useEffect } from "react";
import { Box, Text, Button, VStack, HStack, Grid, GridItem, Flex } from "@chakra-ui/react";
import { AiOutlineEdit, AiOutlineLogout } from "react-icons/ai";
import { FaUserPlus } from "react-icons/fa";
import { Avatar } from "@/components/ui/avatar"
import { IconButton } from "@chakra-ui/react"
import { useUser } from "@/userContext";

// Mock user data
// const user = {
//   username: "Naveen Singh",
//   handle: "@naveen",
//   bio: "Political Consultant | Veer Bhogya Vasundharas | Patriot | E-Majdoor | Political Observer",
//   following: 291,
//   followers: 23,
//   profilePic: "https://bit.ly/dan-abramov",
//   coverPhoto: "https://bit.ly/ryan-florence",
// };

const ProfileDetail = () => {
    const { user, setUser, logout } = useUser(); 
    
    
      useEffect(() => {
        if (!user) {
          
          fetch('http://localhost:3000/api/users', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token
            },
          })
            .then((res) => res.json())
            .then((data) => {
              setUser(data);
              
            })
            .catch((err) => console.error('Error fetching user:', err));
        }
      }, [user, setUser]);
  return (
    <div className="posts">

    
        <Box bg="gray.900" color="white" p={5}>
            {/* Profile Info */}
            <Box bg="gray.800" p={4} borderRadius="md" mb={5}>
                <HStack gap={6}>
                <Avatar size="xl" src={user.profile_pic} name={user.username} />
                <VStack align="start" gap={2}>
                    <Text fontSize="2xl" fontWeight="bold">{user.username}</Text>
                    <Text fontSize="lg" color="gray.400">{user.fullname}</Text>
                    <Text>{user.bio}</Text>
                    <HStack gap={3}>
                    <Text>{user.following} Following</Text>
                    <Text>{user.followers} Followers</Text>
                    </HStack>
                    <Button colorScheme="teal" variant="outline">
                        <AiOutlineEdit /> Edit Profile
                    </Button>
                </VStack>
                </HStack>
            </Box>

            {/* Recent Posts */}
            <Box bg="gray.800" p={4} borderRadius="md" mb={5}>
                <Text fontSize="xl" fontWeight="bold" mb={3}>Recent Posts</Text>
                <Box p={4} bg="gray.700" borderRadius="md" mb={3}>
                <Text fontSize="lg" fontWeight="bold">Naveen Singh</Text>
                <Text color="gray.400">4 hours ago</Text>
                <Text mt={2}>Well beauty is in the eye of the beholder.</Text>
                <HStack mt={2}>
                    <Button variant="ghost" size="sm"><AiOutlineEdit /> Edit</Button>
                    <Button variant="ghost" size="sm"><AiOutlineLogout /> Delete</Button>
                </HStack>
                </Box>
                <Box p={4} bg="gray.700" borderRadius="md">
                <Text fontSize="lg" fontWeight="bold">Naveen Singh</Text>
                <Text color="gray.400">12 hours ago</Text>
                <Text mt={2}>Yogis menu is good. Mango lassos are also good. I have a special mango smoothie.</Text>
                </Box>
            </Box>

        
        </Box>
    </div>
  );
};

export default ProfileDetail;
