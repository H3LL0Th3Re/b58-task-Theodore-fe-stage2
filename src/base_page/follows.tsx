import React, { useState, useEffect } from "react";
import { Box, Text, Flex, Button, Center, Spinner } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { jwtDecode } from "jwt-decode";
import * as Tabs from "@radix-ui/react-tabs";

type User = {
  id: string;
  username: string;
  avatarUrl: string;
  description: string;
};

const toggleFollow = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");
    const decodedToken: any = jwtDecode(token!);
    const currentUserId = decodedToken.userId;

    const response = await fetch("http://localhost:3000/api/users/toggle-follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        followerId: currentUserId,
        followingId: userId,
      }),
    });

    const data = await response.json();
    alert(data.message); // Show a message (Followed/Unfollowed)
  } catch (error) {
    console.error("Error toggling follow:", error);
  }
};

const FollowPage = () => {
  const [tab, setTab] = useState("Following"); // "Following" or "Followers"
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem("token");
  const decodedToken: any = jwtDecode(token!);
  const currentUserId = decodedToken.id;

  const fetchData = async () => {
    if (!currentUserId) return;
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };

    try {
      const endpoint = tab === "Following" ? "following" : "followers";
      const response = await fetch(
        `http://localhost:3000/api/users/${currentUserId}/${endpoint}`,
        { headers }
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  return (
    <Box bg="gray.900" color="white" minH="100vh" p={5}>
      <Flex align="center" justify="center" mb={5}>
        <Text fontSize="2xl" fontWeight="bold">
          Follows
        </Text>
      </Flex>
      <Tabs.Root value={tab} onValueChange={(value) => setTab(value)}>
        <Tabs.List
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            borderBottom: "1px solid gray",
            paddingBottom: "8px",
          }}
        >
          <Tabs.Trigger
            value="Following"
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              color: tab === "Following" ? "white" : "gray",
              fontWeight: tab === "Following" ? "bold" : "normal",
              borderBottom: tab === "Following" ? "2px solid green" : "none",
            }}
          >
            Following
          </Tabs.Trigger>
          <Tabs.Trigger
            value="Followers"
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              color: tab === "Followers" ? "white" : "gray",
              fontWeight: tab === "Followers" ? "bold" : "normal",
              borderBottom: tab === "Followers" ? "2px solid green" : "none",
            }}
          >
            Followers
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="Following">
          {loading ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : (
            <Flex direction="column" gap={3} mt={5}>
              {users.length === 0 ? (
                <Text color="gray.400" textAlign="center">
                  No users found.
                </Text>
              ) : (
                users.map((user) => (
                  <Flex
                    key={user.id}
                    align="center"
                    bg="gray.800"
                    p={4}
                    borderRadius="md"
                    justify="space-between"
                  >
                    <Flex align="center" gap={3}>
                      <Avatar src={user.avatarUrl} name={user.username} size="sm" />
                      <Box>
                        <Text fontWeight="bold">{user.username}</Text>
                        <Text fontSize="sm" color="gray.400" noOfLines={1}>
                          {user.description}
                        </Text>
                      </Box>
                    </Flex>
                    <Button
                      size="sm"
                      bg="gray.700"
                      color="green.400"
                      _hover={{ bg: "gray.600" }}
                      onClick={() => toggleFollow(user.id)}
                    >
                      Following
                    </Button>
                  </Flex>
                ))
              )}
            </Flex>
          )}
        </Tabs.Content>

        <Tabs.Content value="Followers">
          {loading ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : (
            <Flex direction="column" gap={3} mt={5}>
              {users.length === 0 ? (
                <Text color="gray.400" textAlign="center">
                  No users found.
                </Text>
              ) : (
                users.map((user) => (
                  <Flex
                    key={user.id}
                    align="center"
                    bg="gray.800"
                    p={4}
                    borderRadius="md"
                    justify="space-between"
                  >
                    <Flex align="center" gap={3}>
                      <Avatar src={user.avatarUrl} name={user.username} size="sm" />
                      <Box>
                        <Text fontWeight="bold">{user.username}</Text>
                        <Text fontSize="sm" color="gray.400" noOfLines={1}>
                          {user.description}
                        </Text>
                      </Box>
                    </Flex>
                    <Button
                      size="sm"
                      bg="blue.400"
                      color="white"
                      _hover={{ bg: "blue.300" }}
                      onClick={() => toggleFollow(user.id)}
                    >
                      Follow
                    </Button>
                  </Flex>
                ))
              )}
            </Flex>
          )}
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export default FollowPage;
