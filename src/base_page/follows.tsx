import React, { useState } from "react";
import { Box, Text, Flex, Button, Center } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
type User = {
  username: string;
  avatarUrl: string;
  description: string;
  isFollowing: boolean;
};

const mockUsers: User[] = [
  {
    username: "rach",
    avatarUrl: "https://bit.ly/dan-abramov",
    description: "All for Jesus and the A #GoGBraves",
    isFollowing: true,
  },
  {
    username: "ahmad",
    avatarUrl: "https://bit.ly/ryan-florence",
    description: "Author of PracticalUI",
    isFollowing: false,
  },
  {
    username: "mario",
    avatarUrl: "https://bit.ly/kent-c-dodds",
    description: "Post about Product Design + My Experience",
    isFollowing: true,
  },
  {
    username: "camila",
    avatarUrl: "https://bit.ly/joe-gerrity",
    description: "Learning Web Development",
    isFollowing: false,
  },
  // Add more users as needed
];

const FollowPage = () => {
  const [followingTab, setFollowingTab] = useState<boolean>(true); // State to switch between "Followers" and "Following"
  const [users, setUsers] = useState<User[]>(mockUsers);

  const toggleTab = () => {
    setFollowingTab(!followingTab);
  };

  const followUser = (username: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.username === username
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    );
  };

  return (
    <Box bg="gray.900" color="white" minH="100vh" p={5}>
      <Flex align="center" mb={5}>
        <Text fontSize="2xl" fontWeight="bold">
          Follows
        </Text>
        <Button
          ml="auto"
          bg="green.500"
          color="white"
          _hover={{ bg: "green.600" }}
          onClick={toggleTab}
        >
          {followingTab ? "Followers" : "Following"}
        </Button>
      </Flex>

      <Flex direction="column" gap={4}>
        {users
          .filter((user) => (followingTab ? user.isFollowing : !user.isFollowing))
          .map((user) => (
            <Flex key={user.username} align="center" bg="gray.800" p={4} borderRadius="md">
              <Avatar src={user.avatarUrl} name={user.username} />
              <Box ml={4}>
                <Text fontWeight="bold">{user.username}</Text>
                <Text fontSize="sm" color="gray.400">
                  {user.description}
                </Text>
              </Box>
              <Button
                ml="auto"
                variant={user.isFollowing ? "outline" : "solid"}
                colorScheme={user.isFollowing ? "red" : "green"}
                onClick={() => followUser(user.username)}
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </Flex>
          ))}
      </Flex>
    </Box>
  );
};

export default FollowPage;
