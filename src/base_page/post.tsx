import React from 'react';
import { Box, VStack, HStack ,Heading, Button, Text, Flex, Grid, Image} from '@chakra-ui/react';
import { Avatar } from "@/components/ui/avatar"
import { IoHeart } from "react-icons/io5"
import { Rating } from "@/components/ui/rating"
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
import { IconButton } from "@chakra-ui/react"
import { LuImage, LuSearch } from "react-icons/lu"
import { Separator, Stack } from "@chakra-ui/react"
import { IoHeartOutline } from "react-icons/io5";
import { useStore } from "@/useStore";
// Sample data for posts
import { useEffect } from "react";
import { getAllThreads } from '@/services/thread.services';
import { ThreadsType } from '@/types/threads.types';
import { UsersType } from '@/types/users.types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from "react-router-dom";

function Posts() {
  // Access posts and likeState from the store
  const { posts, setPosts, likeState } = useStore();
  const { toggleLike, getLikes } = likeState;
  const navigate = useNavigate();
  const [replyInput, setReplyInput] = useState<Record<number, string>>({}); // Tracks reply inputs for each post
  const [showReplyBox, setShowReplyBox] = useState<Record<number, boolean>>({}); // Tracks which posts show the reply box
  // Initialize posts (use this to load the sample data or fetch from an API)
  
  useEffect(() => {
    const samplePosts = [
      {
        id: 1,
        username: "Theo",
        handle: "@Theo",
        time: "4h",
        content: "Kalian pernah nggak big on saving? Jadi by calculation ...",
        avatar: "https://tse2.mm.bing.net/th?id=OIP.Rgx2IZ1FbVbB8vWUCJPLsAHaEK&pid=Api&P=0&h=180",
        likes: 36,
        isLiked: false,
        replies: 381,
        image: "",
      },
      {
        id: 2,
        username: "Mona",
        handle: "@monnarizqa",
        time: "17h",
        content: "Pernah nggak dapet dream job terus lama-lama ...",
        avatar: "https://staticg.sportskeeda.com/editor/2023/03/c9ac4-16783939058996.png",
        likes: 293,
        isLiked: false,
        replies: 381,
        image: "",
      },
      {
        id: 3,
        username: "Compounding Quality",
        handle: "@QCompounding",
        time: "Jul 25",
        avatar: "",
        content: "52 Books you should know:",
        likes: 500,
        isLiked: false,
        replies: 120,
        image: "https://via.placeholder.com/300",
      },
      {
        id: 4,
        username: "Hugging Face",
        handle: "@HuggingFace",
        time: "Jul 25",
        avatar: "https://tse1.mm.bing.net/th?id=OIP.kJOQp4Tn5N2VAChZ0a5AZgHaC8&pid=Api&P=0&h=180",
        content: "update on hugging face transformers",
        likes: 1000,
        isLiked: false,
        replies: 120,
        image: "https://theaisummer.com/static/385447122c9c6ce73e449fe3a7ecf46a/ee604/hugging-face-vit.png",
      },
    ];
    setPosts(samplePosts);
  }, [setPosts]);

  const [threads, setThreads] = useState<ThreadsType[]>([])
  // const [users, setUsers] = useState<UsersType[]>([])
  useEffect(()=>{
    retriveAllThreads();
  }, []);

  const retriveAllThreads = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found! User is not authenticated.");
      return;
    }
      // getAllusers(token);
    try{
      const threads_list = await getAllThreads(token);
      setThreads(threads_list);
      // console.log(threads_list);
    }catch(error){
      console.log(error);
    }
  }
  

  // localStorage.setItem("thread_id", threads.id);

  return (
    <div className="posts">
      {/* Input for new post */}
      <Flex align="center" mb="5" gap="4" p="4" borderBottom="1px solid" borderColor="gray.300">
        <Avatar
          size="md"
          src="https://tse2.mm.bing.net/th?id=OIP.Rgx2IZ1FbVbB8vWUCJPLsAHaEK&pid=Api&P=0&h=180"
        />
        <Input
          variant="flushed"
          placeholder="What is happening?!"
          color="green.500"
          _placeholder={{ color: "gray.500" }}
        />
        <HStack gap="2">
          <IconButton
            aria-label="Add Image"
            size="sm"
            bg="gray.500"
            _hover={{ bg: "gray.200" }}
          >
            <LuImage />
          </IconButton>
          <Button size="sm" colorScheme="green" bg="green.700" _hover={{ bg: "green.400" }}>
            Post
          </Button>
        </HStack>
      </Flex>

      {/* Posts grid */}
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
                    onClick={() => toggleLike(post.id)}
                    variant="ghost"
                  >
                    {likeState.likedItems.has(post.id) ? (
                      <IoHeart color="red" />
                    ) : (
                      <IoHeartOutline />
                    )}
                  </IconButton>
                  <Text as="span" fontWeight="bold">
                    {/* console.log(`Post ID: ${post.id}, Likes: ${getLikes(post.id)}`) */}
                    {getLikes(post.likes)} Likes
                  </Text>
                </Flex>
                <Button
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    onClick={() => navigate(`/main/post-detail/${post.id}`)} // Redirect to post detail page
                  >
                    💬 Reply
                  </Button>
              </Flex>
            </Flex>
          </Box>
        ))}
      </Grid>
    </div>
  );
}

export default Posts;



