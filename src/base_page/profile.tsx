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

const suggestedUsers = [
  { name: 'Mohammed Jawahir', handle: '@em_jawahir', isFollowing: true },
  { name: 'Shakia Kimathi', handle: '@shakiakim', isFollowing: false },
  { name: 'Naveen Singh', handle: '@naveeens', isFollowing: false },
  { name: 'Jennifer Stewart', handle: '@jennfirste', isFollowing: false },
  { name: 'Zula Chizimu', handle: '@zulachi', isFollowing: false },
];

function Profile() {
  const { user, setUser, logout } = useUser(); 
  const [editedData, setEditedData] = useState({
    fullname: user?.fullname || '',
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    image: user?.image || '',
  });
  

  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  

  const handleImageChange = (e) => {
    const { value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      image: value,
    }));
  };
  

  const handleAvatarChange = (e) => {
    const { value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      avatar: value,
    }));
  };

  const handleSave = () => {
    // setUser(editedData); // Save the changes to UserContext
    updateUserProfile();
  };

  const handleCancel = () => {
    setEditedData(user); // Reset the fields to original user data
  };

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
          setEditedData(data); // Set editedData with fetched user data
        })
        .catch((err) => console.error('Error fetching user:', err));
    } else {
      setEditedData(user); // Populate editedData from context if already available
    }
  }, [user, setUser]);

  const toggleFollow = async (userId) => {
  try {
    const response = await fetch('/api/users/toggle-follow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ followingId: userId }),
    });

    if (response.ok) {
      // After toggling, fetch the updated suggested users
      const updatedResponse = await fetch('/api/users/suggested', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (updatedResponse.ok) {
        const updatedUsers = await updatedResponse.json();
        setSuggestedUsers(updatedUsers); // Update the state with fresh data
      } else {
        console.error('Error fetching updated suggested users:', updatedResponse.statusText);
      }
    } else {
      const data = await response.json();
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const updateUserProfile = async () => {
  try {
    
    const response = await fetch(`http://localhost:3000/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token
      },
      body: JSON.stringify(editedData), // Send edited data
    });

    if (response.ok) {
      const updatedUser = await response.json();
      setUser(updatedUser); // Update the UserContext with the new data
      alert('Profile updated successfully');
    } else {
      const errorData = await response.json();
      alert(errorData.message || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('An error occurred while updating your profile');
  }
};

  // console.log(editedData.id);
  // console.log(editedData.fullname)
  // useEffect(()=>{
  //   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJsZW81NTUiLCJpYXQiOjE3MzQ4ODU5NjcsImV4cCI6MTczNDg4OTU2N30.vaQ3jDFsYjI2G11BcRgNsLcuSEVCunvZx8sNPxH9Td4"
  //   // getAllusers(token);
  //   getAllThreads(token);
  // }, []);

  return (
    <Box bg="gray.900" color="white" minH="100vh" p={5}>
      {/* My Profile Section */}
      <Box bg="gray.800" borderRadius="lg" p={5} mb={6}>
        <Flex justify="space-between" align="center" position="relative" paddingBottom={2}>
          <Image rounded="md" src={editedData.image} alt="User image" height={85} width={400} />
          <Avatar size="xl" name={user.fullname} src={editedData.avatar} position="absolute" bottom={-3} left={3} />
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
                    value={editedData.image}
                    onChange={handleImageChange}
                    onBlur={() => setIsEditingImage(false)}
                  />
                ) : (
                  <Image
                    rounded="md"
                    src={editedData.image}
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
                    value={editedData.avatar}
                    onChange={handleAvatarChange}
                    onBlur={() => setIsEditingAvatar(false)}
                  />
                ) : (
                  <Avatar
                    size="xl"
                    name={editedData.fullname}
                    src={editedData.avatar}
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
            <Text fontWeight="bold">291</Text>
            <Text color="gray.400">Following</Text>
            <Text fontWeight="bold">23</Text>
            <Text color="gray.400">Followers</Text>
          </HStack>
        </VStack>
      </Box>

      {/* Suggested for You Section */}
      <Box bg="gray.800" borderRadius="lg" p={5} mt={6}>
        <Text fontWeight="bold" mb={4}>
          Suggested for you
        </Text>
        {suggestedUsers.map((user, idx) => (
          <Flex justify="space-between" align="center" key={idx} mb={3}>
            <HStack>
              {/* Avatar and User Info */}
              <Avatar size="sm" name={user.name} />
              <VStack align="start" gap={0}>
                <Text fontWeight="bold">{user.name}</Text>
                <Text fontSize="sm" color="gray.400">{user.handle}</Text>
              </VStack>
            </HStack>

            {/* Follow/Following Button */}
            <Button size="sm" variant={user.isFollowing ? 'outline' : 'solid'} colorScheme={user.isFollowing ? 'gray' : 'blue'}>
              {user.isFollowing ? 'Following' : 'Follow'}
            </Button>
          </Flex>
        ))}
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

