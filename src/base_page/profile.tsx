import React, { useEffect } from 'react';
import { useState } from 'react';
import { Card, Input } from "@chakra-ui/react"
import {
    Box,
    Button,
    Flex,
    Text,
    VStack,
    Heading,
    HStack,
    Link,
    Icon,
    Image,
  } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar"
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useUser } from '@/userContext';
import { FaGithub, FaLinkedin, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { getAllusers } from '@/services/users.services';
import { getAllThreads } from '@/services/thread.services';
import { UsersType } from '@/types/users.types';
import { useStore } from '@/useStore';
import axios from "axios";
import {jwtDecode} from "jwt-decode";

function Profile() {
  const { user, updateUser, fetchUser } = useStore();
  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });
  const [editedData, setEditedData] = useState({
    fullname: '',
    username: '',
    bio: '',
    profile_pic: '',
    banner_pic: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<UsersType[]>([]);

  // Sync local state with user data from store
  useEffect(() => {
    if (user) {
      setEditedData({
        fullname: user.fullname || '',
        username: user.username || '',
        bio: user.bio || '',
        profile_pic: user.profile_pic || '',
        banner_pic: user.banner_pic || '',
      });
    }
  }, [user]);

  const token = localStorage.getItem("token");
  const current_user = jwtDecode(token).id;

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchUser();
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    initializeData();
  }, [fetchUser]);

  // Fetch suggested users
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/api/users/${current_user}/suggest-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setSuggestedUsers(data);
      } catch (error) {
        setError('An error occurred while fetching suggested users');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  const getFollowCounts = async (userId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:3000/api/users/${userId}/follow-counts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response.data; // { followersCount, followingCount }
  };

  useEffect(() => {
    const fetchFollowCounts = async () => {
      try {
        console.log("the user: ", current_user);
        const counts = await getFollowCounts(current_user.toString());
        setFollowCounts({
          followers: counts.followersCount,
          following: counts.followingCount,
        });
      } catch (error) {
        console.error("Failed to fetch follow counts:", error);
      }
    };
  
    fetchFollowCounts();
  }, [current_user]);

  console.log(followCounts)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({
      ...prev,
      banner_pic: e.target.value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({
      ...prev,
      profile_pic: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateUser(editedData);
      await fetchUser(); // Refresh user data
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditedData({
        fullname: user.fullname || '',
        username: user.username || '',
        bio: user.bio || '',
        profile_pic: user.profile_pic || '',
        banner_pic: user.banner_pic || '',
      });
    }
  };

  const handleFollowToggle = async (userId: string, isFollowed: boolean) => {
    const updatedUsers = suggestedUsers.map((user) =>
      user.id === userId ? { ...user, isFollowed: !isFollowed } : user
    );
    setSuggestedUsers(updatedUsers);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");

      const decodedToken: { userId: string } = jwtDecode(token);
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

      if (!response.ok) throw new Error("Failed to toggle follow");

      const data = await response.json();
      alert(data.message);
    } catch (error: any) {
      // Rollback UI changes on error
      setSuggestedUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isFollowed } : user
        )
      );
      alert(error.message || "An error occurred while toggling follow");
    }
  };

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;
  if (!user) return <Box>Please log in to view your profile</Box>;

  

  return (
    <Box bg="gray.900" color="white" minH="100vh" p={5}>
      {/* My Profile Section */}
      <Box bg="gray.800" borderRadius="lg" p={5} mb={6}>
        <Flex justify="space-between" align="center" position="relative" paddingBottom={2}>
          <Image rounded="md" src={user.banner_pic} alt="User image" height={85} width={400} />
          <Avatar size="xl" name={user.username} src={user.profile_pic} position="absolute" bottom={-3} left={3} />
        </Flex>

        {/* Edit Profile Button */}
        <DialogRoot key="md" size="md">
          <DialogTrigger asChild>
            <Button variant="outline" borderColor="whiteAlpha.400" height={8} left={300} borderRadius={30}>
              Edit Profile
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User Profile</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Flex justify="space-between" align="center" position="relative" paddingBottom={2}>
                {/* Editable Image Section */}
                {isEditingImage ? (
                  <Input
                    type="text"
                    placeholder="Enter image URL"
                    value={editedData.banner_pic}
                    onChange={handleImageChange}
                    onBlur={() => setIsEditingImage(false)}
                  />
                ) : (
                  <Image
                    rounded="md"
                    src={editedData.banner_pic}
                    alt="User image"
                    height={85}
                    width={400}
                    onClick={() => setIsEditingImage(true)}
                    style={{ cursor: 'pointer' }}
                  />
                )}

                {/* Editable Avatar Section */}
                {isEditingAvatar ? (
                  <Input
                    type="text"
                    placeholder="Enter avatar URL"
                    value={editedData.profile_pic}
                    onChange={handleAvatarChange}
                    onBlur={() => setIsEditingAvatar(false)}
                  />
                ) : (
                  <Avatar
                    size="xl"
                    name={editedData.fullname}
                    src={editedData.profile_pic}
                    position="absolute"
                    bottom={-3}
                    left={3}
                    onClick={() => setIsEditingAvatar(true)}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </Flex>

              {/* Editable Fields */}
              <div style={{ marginTop: '2rem' }}>
                <label>Name</label>
                <Input
                  type="text"
                  name="fullname"
                  value={editedData.fullname}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginBottom: '1rem',
                    borderRadius: '0.5rem',
                  }}
                />

                <label>Username</label>
                <Input
                  type="text"
                  name="username"
                  value={editedData.username}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginBottom: '1rem',
                    borderRadius: '0.5rem',
                  }}
                />

                <label>Bio</label>
                <textarea
                  name="bio"
                  value={editedData.bio}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    height: '5rem',
                    borderRadius: '0.5rem',
                  }}
                />
              </div>
            </DialogBody>

            {/* Dialog Footer with Save and Cancel */}
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </DialogActionTrigger>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>

            <DialogCloseTrigger />
          </DialogContent>
        </DialogRoot>

        <VStack align="start" mt={4}>
          <Heading size="md">{user.fullname}</Heading>
          <Text fontSize="sm" color="gray.400">@{user.username}</Text>
          <Text fontSize="sm">{user.bio}</Text>
          <HStack>
          <Text fontWeight="bold">{followCounts.following}</Text>
          <Text color="gray.400">Following</Text>
          <Text fontWeight="bold">{followCounts.followers}</Text>
          <Text color="gray.400">Followers</Text>
          </HStack>
        </VStack>
      </Box>

      {/* Suggested for You Section */}
      <Box bg="gray.800" borderRadius="lg" p={5} mt={6}>
        <Text fontWeight="bold" mb={4}>
          Suggested for you
        </Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : suggestedUsers && suggestedUsers.length > 0 ? (
          suggestedUsers.map((user) => (
            <Box display="flex" key={user.id} gap={3} mb={3}>
              <Avatar src={user.profile_pic} />
              <Box>
                <Text color="white">{user.fullname}</Text>
                <Text color="gray.400">@{user.username}</Text>
              </Box>
              
              <Button
                onClick={() =>handleFollowToggle(user.id, user.isFollowed)}
                variant="outline"
                color="white"
              >
                {user.isFollowed ? 'Followed' : 'Follow'}
              </Button>
            </Box>
          ))
        ) : (
          <Text>No suggested users found</Text>
        )}
      </Box>

      {/* Footer */}
      <Box textAlign="center" mt={10}>
        <Text fontSize="sm" color="gray.500">
          Developed by <Link color="blue.400">Theodore</Link> • Powered by
          <Link color="blue.400" ml={1}>DumbWays Indonesia</Link>
        </Text>
      </Box>
    </Box>
  );
}

export default Profile;

