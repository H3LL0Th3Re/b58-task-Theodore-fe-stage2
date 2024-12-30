import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Input,
  Button,
  VStack,
  HStack
} from "@chakra-ui/react";
import {Divider} from "@chakra-ui/layout"
import { Avatar } from "@/components/ui/avatar"
import { useParams } from "react-router-dom";
import axios from "axios";
import { response } from "express";
import { threadId } from "worker_threads";


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

function DetailedPost() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [replyText, setReplyText] = useState("");
  // Fetch post details and replies
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/thread/${postId}`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => console.error("Error fetching post data:", error));
  }, [postId]);

  

  

  // Handle adding a reply
  const handleReply = () => {
    const token = localStorage.getItem("token");
  
    if (!replyText.trim()) {
      console.error("Reply text cannot be empty.");
      return;
    }
  
    if (!token) {
      console.error("Token is missing or invalid.");
      return;
    }
  
    axios
      .post(
        `http://localhost:3000/api/thread/reply`,
        {
          content: replyText,
          threadId: postId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        setPost((prev) => {
          // Ensure `prev` is never null or undefined
          if (!prev) return null;
  
          return {
            ...prev,
            thread: {
              ...prev.thread,
              replies: [...(prev.thread.replies || []), response.data],
            },
          };
        });
        setReplyText("");
      })
      .catch((error) => console.error("Error posting reply:", error));
  };
  
  

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
        </Box>
      </HStack>

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
              <Text fontWeight="bold">{reply?.user?.username}</Text>
              <Text fontSize="sm" color="gray.500">
                {new Date(reply.createdAt).toLocaleString()}
              </Text>
              <Text mt="1">{reply.content}</Text>
            </Box>
          </HStack>
        ))}
      </VStack>

      {/* Add Reply Input */}
      <Box mt="4">
        <Input
          placeholder="Type your reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <Button mt="2" colorScheme="green" onClick={handleReply}>
          Reply
        </Button>
      </Box>
    </Box>
  );
};

export default DetailedPost;
