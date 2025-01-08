import React, { useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Flex,
  Grid,
  Image,
  Textarea,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { IoHeart, IoHeartOutline, IoEllipsisVertical } from "react-icons/io5";
import { LuImage } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useThreadStore } from "@/useThreadStore";
import { useUser } from "@/userContext";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStore } from "@/useStore";

function Posts() {
  const { user } = useStore();
  const navigate = useNavigate();
  // const { user } = useUser();
  const {
    isLikedByUser,
    threads,
    content,
    setContent,
    setImageFile,
    fetchThreads,
    handlePost,
    handleEdit,
    handleDelete,
    toggleLike,
    getLikeCount,
    imagePreview,
    imageFile
  } = useThreadStore();

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    if (!imagePreview && imageFile) {
      const reader = new FileReader();
      // reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const handlePostAndReset = async () => {
    await handlePost();
    setContent("");
    setImageFile(null);
    // setImagePreview(null);
  };

  const handleEditAndReset = async (postId: string) => {
    await handleEdit(postId);
    setContent("");
    setImageFile(null);
    // setImagePreview(null);
  };

  const handleLikeToggle = async (postId: string) => {
    await toggleLike(postId);
  };

  return (
    <div className="posts">
      <Flex
        align="center"
        mb="5"
        gap="4"
        p="4"
        borderBottom="1px solid"
        borderColor="gray.300"
      >
        <Avatar size="md" name={user?.username} src={user?.profile_pic} />
        <Input
          variant="flushed"
          placeholder="What is happening?!"
          color="green.500"
          _placeholder={{ color: "gray.500" }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <HStack gap="2">
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

          <Button
            size="sm"
            colorScheme="green"
            bg="green.700"
            _hover={{ bg: "green.400" }}
            onClick={handlePostAndReset}
          >
            Post
          </Button>
        </HStack>

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{ width: "200px" }}
          />
        )}
      </Flex>

      <Grid gap="6" templateColumns={{ base: "1fr", md: "1fr" }} mt="6">
        {threads.length > 0 &&
          threads.map((post) => (
            <Box
              key={post.id}
              p="4"
              borderBottom="1px solid"
              borderColor="gray.200"
            >
              <Flex direction="column" gap="4">
                <Flex align="start" gap="4">
                  <Avatar
                    size="lg"
                    name={post.author?.username}
                    src={post.author?.profile_pic}
                  />
                  <Box>
                    <Text fontWeight="bold">
                      {post.author?.fullname}{" "}
                      <Text as="span" fontWeight="normal" color="gray.500">
                        @{post.author?.username}
                      </Text>{" "}
                      • {post.createdAt.toString()}
                      {post.author?.id === user?.id && (
                        <MenuRoot>
                          <MenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              color="white"
                              bg="transparent"
                              _hover={{ bg: "none" }}
                              _focus={{ boxShadow: "none" }}
                              position="relative"
                            >
                              <IoEllipsisVertical />
                            </Button>
                          </MenuTrigger>
                          <MenuContent>
                            <DialogRoot>
                              <DialogTrigger asChild>
                                <MenuItem value="edit">Edit</MenuItem>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>Update your post</DialogHeader>
                                <DialogBody>
                                  <Textarea
                                    placeholder="Comment..."
                                    value={content}
                                    onChange={(e) =>
                                      setContent(e.target.value)
                                    }
                                  />
                                  <IconButton
                                    aria-label="Add Image"
                                    size="sm"
                                    as="label"
                                  >
                                    <LuImage />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      style={{ display: "none" }}
                                      onChange={(e) =>
                                        setImageFile(e.target.files[0])
                                      }
                                    />
                                  </IconButton>
                                  {imagePreview && (
                                    <img
                                      src={imagePreview}
                                      alt="Preview"
                                      style={{ width: "200px" }}
                                    />
                                  )}
                                </DialogBody>
                                <DialogFooter>
                                  <DialogActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogActionTrigger>
                                  <Button
                                    onClick={() =>
                                      handleEditAndReset(post.id)
                                    }
                                  >
                                    Save
                                  </Button>
                                </DialogFooter>
                                <DialogCloseTrigger />
                              </DialogContent>
                            </DialogRoot>
                            <MenuItem
                              value="delete"
                              onClick={() => handleDelete(post.id)}
                            >
                              Delete
                            </MenuItem>
                          </MenuContent>
                        </MenuRoot>
                      )}
                    </Text>
                    <Text fontSize="md" mt="2" color="gray.100">
                      {post.content}
                    </Text>
                    {post.image && (
                      <Box mt="4" rounded="lg" overflow="hidden">
                        <Image
                          src={post.image}
                          alt="Post"
                          width="100%"
                          objectFit="cover"
                          borderRadius="8px"
                        />
                      </Box>
                    )}
                  </Box>
                </Flex>

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
                      {getLikeCount(post.id.toString())} Likes
                    </Text>
                  </Flex>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    onClick={() =>
                      navigate(`/main/post-detail/${post.id}`)
                    }
                  >
                    {post?.replies?.length || 0} 💬 Reply
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
