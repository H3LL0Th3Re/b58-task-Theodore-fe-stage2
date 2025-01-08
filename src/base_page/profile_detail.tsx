import React, { useEffect } from 'react';
import { useState } from 'react';
import { Card, GridItem, IconButton, Input } from "@chakra-ui/react"
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
import { ThreadsType } from '@/types/threads.types';
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { Grid } from '@chakra-ui/layout';
import { useNavigate } from 'react-router-dom';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { useStore } from "@/useStore";
import axios, { all } from 'axios';
import * as Tabs from "@radix-ui/react-tabs";
import { useThreadStore } from '@/useThreadStore';
import { jwtDecode } from 'jwt-decode';


const ProfileDetail = () => {
  const { user, updateUser, fetchUser } = useStore();
  
  const navigate = useNavigate();
  const {
      isLikedByUser,
      threads,
      content,
      setContent,
      setImageFile,
      fetchThreadUser,
      handlePost,
      handleEdit,
      handleDelete,
      toggleLike,
      getLikeCount,
      imagePreview,
      imageFile
    } = useThreadStore();
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
  
  
  const handleLikeToggle = async (postId: string) => {
    await toggleLike(postId);
  };

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

  
  
  const getLikes = (post: ThreadsType): number => {
    if (!post || !post.likes) return 0;
    return post.likes.length;
  };

  

  // useEffect(() => {
  //   if (user?.id) {  // Only fetch if we have a user ID
  //     fetchThreads();
  //   }
  // }, [user?.id]); // Add user?.id as a dependency

  useEffect(() => {
    fetchThreadUser();
  }, []);

  const [tabValue, setTabValue] = useState('recent_post');

  // console.log(threads);


  return (
    <div className="posts">
      <Box bg="gray.900" color="white" p={5}>
        {/* Profile Info */}
        <Box bg="gray.800" borderRadius="lg" p={5} mb={6}>
          <Flex justify="space-between" align="center" position="relative" paddingBottom={2}>
            <Image rounded="md" src={user?.banner_pic} alt="User image" height={150} width="100%" style={{ objectFit: "cover" }}/>
            <Avatar size="xl" name={user?.fullname} src={user?.profile_pic} position="absolute" bottom={-7} left={5} width="80px" height="80px" />
          </Flex>
  
          {/* Edit Profile Button */}
          <DialogRoot key="md" size="md">
            <DialogTrigger asChild>
              <Button variant="outline" borderColor="whiteAlpha.400" height={8} left={630} borderRadius={30}>
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
            <Heading size="md">{editedData.fullname}</Heading>
            <Text fontSize="sm" color="gray.400">@{editedData.username}</Text>
            <Text fontSize="sm">{editedData.bio}</Text>
            <HStack>
              <Text fontWeight="bold">{followCounts.following}</Text>
              <Text color="gray.400">Following</Text>
              <Text fontWeight="bold">{followCounts.followers}</Text>
              <Text color="gray.400">Followers</Text>
            </HStack>
          </VStack>
        </Box>

        {/* Recent Threads */}

        <Tabs.Root value={tabValue} onValueChange={setTabValue}>
          <Box position="relative">
            <Tabs.List style={{
              margin: '30px',
              display: 'flex',
              justifyContent: 'space-around',
              position: 'relative',
            }}>
              <Tabs.Trigger value='recent_post' style={{
                padding: '8px 16px',
                cursor: 'pointer',
                color: tabValue === 'All Post' ? 'white' : 'gray',
                fontWeight: tabValue === 'All Post' ? 'bold' : 'normal',
              }}>
                Recent Post
              </Tabs.Trigger>
              <Tabs.Trigger value="media_post" style={{
                padding: '8px 16px',
                cursor: 'pointer',
                color: tabValue === 'Media' ? 'white' : 'gray',
                fontWeight: tabValue === 'Media' ? 'bold' : 'normal',
              }}>
                Media
              </Tabs.Trigger>
            </Tabs.List>
          </Box>
          
            <Tabs.Content value="recent_post">
              <Box bg="gray.800" p={4} borderRadius="md" mb={5}>
                <Text fontSize="xl" fontWeight="bold" mb={3}>
                  Recent Threads
                </Text>
                <Grid gap="6" templateColumns={{ base: "1fr", md: "1fr" }} mt="6">
                  {threads.length > 0 && threads.map((post) => (
                    <Box key={post.id} p="4" borderBottom="1px solid" borderColor="gray.200">
                      <Flex direction="column" gap="4">
                        {/* Post Header */}
                        <Flex align="start" gap="4">
                          {/* <Avatar size="lg" name={post.username} src={post.avatar} /> */}
                          <Avatar size="lg" name={post.author?.username} src={post.author?.profile_pic} />
                          <Box>
                            <Text fontWeight="bold">
                              {post.author?.username}{" "}
                              
                              <Text as="span" fontWeight="normal" color="gray.500">
                                @{post.author?.fullname}
                              </Text>{" "}
                              • {post.createdAt.toString()}
                              {/* {"4h"} */}
                            </Text>
                            <Text fontSize="md" mt="2" color="gray.100">
                              {post.content}
                            </Text>
                            {/* Post Image */}
                            {post.image && (
                              <Box mt="4" rounded="lg" overflow="hidden">
                                <Image
                                  src={post.image}
                                  alt="Post"
                                  width= "100%"
                                  objectFit= "cover"
                                  borderRadius= "8px"
                                />
                              </Box>
                            )}
                          </Box>
                        </Flex>
          
                        {/* Post Actions */}
                        <Flex justify="space-between" align="center" mt="4">
                          <Flex gap="2" align="center">
                            <IconButton
                              aria-label="Like"
                              onClick={() => handleLikeToggle(post.id.toString())}
                              variant="ghost"
                            >
                              {isLikedByUser(post.id.toString()) ? (
                                <IoHeart color="red" />
                              ) : (
                                <IoHeartOutline />
                              )}
                            </IconButton>
                            <Text as="span" fontWeight="bold">
                              {getLikes(post)} Likes
                            </Text>
                          </Flex>
                          <Button
                              size="sm"
                              colorScheme="blue"
                              variant="ghost"
                              onClick={() => navigate(`post-detail/${post.id}`)} // Redirect to post detail page
                            >
                              {post?.replies?.length || 0} 💬 Reply
                            </Button>
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                </Grid>
              </Box>
            </Tabs.Content>

            <Tabs.Content value="media_post">
              {threads.some((thread) => thread.image) ? (
                <Grid templateColumns="repeat(3, 1fr)" gap={4} mt={4}>
                  {threads
                    .filter((thread) => thread.image)
                    .map((thread) => (
                      <GridItem key={thread.id}>
                        <Image
                          src={thread.image}
                          width="244px"
                          height="244px"
                          objectFit="cover"
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => navigate(`image-detail/${thread.id}`)}
                        />
                      </GridItem>
                    ))}
                </Grid>
              ) : (
                <Text color="gray.500" textAlign="center" mt={4}>
                  No media uploaded yet.
                </Text>
              )}
            </Tabs.Content>
        </Tabs.Root>        
      </Box>
    </div>
  );
};

export default ProfileDetail;
