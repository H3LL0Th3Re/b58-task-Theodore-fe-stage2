import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  Image,
  Textarea,
  IconButton,
  Flex
} from "@chakra-ui/react";
import {Divider} from "@chakra-ui/layout"
import { Avatar } from "@/components/ui/avatar"
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu';
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
} from "@/components/ui/dialog";
import { IoHeart, IoHeartOutline, IoEllipsisVertical } from "react-icons/io5";
import { LuImage } from "react-icons/lu";
import { useThreadStore } from "@/useThreadStore";
import { useUser } from "@/userContext";
// Define types for Post and Reply
interface Reply {
  id: number;
  username: string;
  avatar: string;
  text: string;
  createdAt: string;
}

interface Post {
  id: number;
  username: string;
  avatar: string;
  text: string;
  createdAt: string;
  replies: Reply[];
}

function DetailedPostProfile() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  // const [replyText, setReplyText] = useState("");
  const {
      isLikedByUser,
      fetchThreads,
      threads,
      content,
      setContent,
      setImageFile,
      handleReply,
      handleEdit,
      handleDelete,
      toggleLike,
      getLikeCount,
      fetchThreadbyId,
      imagePreview
    } = useThreadStore();
  const { user } = useUser();
  // Fetch post details and replies
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/thread/${postId}`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => console.error("Error fetching post data:", error));
  }, [postId]);

  

  // console.log(post);

  useEffect(() => {
      fetchThreads();
  }, []);

  // useEffect(() => {
  //   if (postId) {
  //     loadLikeStates();
  //   }
  // }, [postId]);

  

  

  // Handle adding a reply
  // const handleReply = () => {
  //   const token = localStorage.getItem("token");
  
  //   if (!replyText.trim()) {
  //     console.error("Reply text cannot be empty.");
  //     return;
  //   }
  
  //   if (!token) {
  //     console.error("Token is missing or invalid.");
  //     return;
  //   }
  
  //   axios
  //     .post(
  //       `http://localhost:3000/api/thread/reply`,
  //       {
  //         content: replyText,
  //         threadId: postId,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       setPost((prev) => {
  //         // Ensure `prev` is never null or undefined
  //         if (!prev) return null;
  
  //         return {
  //           ...prev,
  //           thread: {
  //             ...prev.thread,
  //             replies: [...(prev.thread.replies || []), response.data],
  //           },
  //         };
  //       });
  //       setReplyText("");
  //     })
  //     .catch((error) => console.error("Error posting reply:", error));
  // };

  const handleReplySubmit = async () => {
    if (!post?.thread.id) {
      console.error("No thread ID available");
      return;
    }

    try {
      await handleReply(post?.thread.id.toString());
      // console.log(replies)
      
      // Refresh the post data after successful reply
      const response = await axios.get(`http://localhost:3000/api/thread/${postId}`);
      setPost(response.data);
    } catch (error) {
      console.error("Failed to submit reply:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleLikeToggle = async () => {
    if (!post?.thread.id) return;
    
    await toggleLike(post.thread.id.toString());
    // Refresh the post data to get updated like status
    const updatedPost = await fetchThreadbyId(postId);
    setPost(updatedPost);
  };
  
  
  // console.log(setImageFile);
  if (!post) return <Text>Loading...</Text>;
  
  return (
    <Box maxW="600px" mx="auto" p="4">
      {/* Post Header */}
      <HStack gap="4" alignItems="flex-start">
        <Avatar src={post.avatar} name={post?.thread.author.username} />
        <Box>
          <Text fontWeight="bold">{post?.thread.author.username}</Text>
          <Text fontSize="sm" color="gray.500">
            {new Date(post?.thread.createdAt).toLocaleString()}
          </Text>
          <Text mt="2">{post?.thread.content}</Text>
          
          {post?.thread.image && (
            <DialogRoot>
              <DialogTrigger asChild>
                <Box mt="4" rounded="lg" overflow="hidden">
                  <Image
                    src={post?.thread.image}
                    alt="Post"
                    width= "100%"
                    objectFit= "cover"
                    borderRadius= "8px"
                  />
                </Box>
              </DialogTrigger>
              <DialogContent style={{
                  width: '80%', // Set dialog width (adjust as needed)
                  maxWidth: '1200px', // Set a maximum width for responsiveness
                  height: 'auto', // Allow dynamic height based on content
                  padding: '16px', // Add padding for inner spacing
                  borderRadius: '16px', // Round the corners
                }}>
                <Box mt="4" rounded="lg" overflow="hidden">
                  <Image
                    src={post?.thread.image}
                    alt="Post"
                    width= "100%"
                    objectFit= "cover"
                    borderRadius= "8px"
                  />
                </Box>
              </DialogContent>
            </DialogRoot>
          )}
          
        </Box>
        
      </HStack>
      <Flex justify="space-between" align="center" mt="4">
          <Flex gap="2" align="center">
            <IconButton
              aria-label="Like"
              onClick={handleLikeToggle}
              variant="ghost"
            >
              {isLikedByUser(post?.thread.id.toString()) ? (
                <IoHeart color="red" />
              ) : (
                <IoHeartOutline />
              )}
            </IconButton>
            <Text as="span" fontWeight="bold">
              {getLikeCount(post?.thread.id.toString())} Likes
            </Text>
          </Flex>
          <Button
            size="sm"
            colorScheme="blue"
            variant="ghost"
          >
            {post?.thread.replies?.length || 0} 💬 Reply
          </Button>
        </Flex>

      <Divider my="4" />

      {/* Reply Section */}
      <Text fontWeight="bold" mb="2">
        Replies
      </Text>
      <VStack align="stretch" gap="4">
        {post?.thread.replies.map((reply) => (
          <HStack key={reply.id} alignItems="flex-start" gap="4">
            <Avatar src={reply.avatar} name={reply?.user?.username} />
            <Box>
              <Text fontWeight="bold">
                {reply?.user?.username}
                
              </Text>
              <Text fontSize="sm" color="gray.500">
                {new Date(reply.createdAt).toLocaleString()}
              </Text>
              <Text mt="1">{reply.content}</Text>
              
                <DialogRoot>
                  <DialogTrigger asChild>
                    <Box mt="4" rounded="lg" overflow="hidden">
                      <Image
                        src={reply.replyImage}
                        alt="Post"
                        width= "100%"
                        objectFit= "cover"
                        borderRadius= "8px"
                      />
                    </Box>
                  </DialogTrigger>
                  <DialogContent style={{
                      width: '80%', // Set dialog width (adjust as needed)
                      maxWidth: '1200px', // Set a maximum width for responsiveness
                      height: 'auto', // Allow dynamic height based on content
                      padding: '16px', // Add padding for inner spacing
                      borderRadius: '16px', // Round the corners
                    }}>
                    <Box mt="4" rounded="lg" overflow="hidden">
                      <Image
                        src={reply.replyImage}
                        alt="Post"
                        width= "100%"
                        objectFit= "cover"
                        borderRadius= "8px"
                      />
                    </Box>
                  </DialogContent>
              </DialogRoot>
            
            </Box>
            {/* <Box mt="4" rounded="lg" overflow="hidden">

              <Image
                src={reply.replyImage}
                alt="Post"
                width= "100%"
                objectFit= "cover"
                borderRadius= "8px"
              />
            </Box> */}
          </HStack>
          
        ))}
        
      </VStack>

      {/* Add Reply Input */}
      <Box mt="4">
        <Input
          placeholder="Type your reply..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '200px' }} />}
        
        <IconButton
          aria-label="Add Image"
          size="sm"
          bg="gray.500"
          _hover={{ bg: "gray.200" }}
          as="label"
        >
          <LuImage />
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            name="image"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </IconButton>
        
        <Button mt="2" colorScheme="green" onClick={handleReplySubmit}>
          Reply
        </Button>
        
        
      </Box>
    </Box>
  );
};

export default DetailedPostProfile;
