import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  Text,
  Link,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { toaster } from "@/components/ui/toaster";
import { z } from "zod";
import { useStore } from "@/useStore";
const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: LoginFormInputs) => {
    setLoading(true);
    setError(null);
    navigate("/login");

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const responseData = await response.json();
      // console.log(responseData.user.username);
      toaster.create({
        title: "Login Successful",
        description: `Welcome back ${responseData.user.username}!`,
        type: "success",
        duration: 3000,
      });
      localStorage.setItem("token", responseData.token);
      useStore.getState().login(responseData.token);
      // console.log(responseData.user);
      navigate("/main");
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="gray.900"
      color="white"
      p={4}
    >
      <Box
        bg="gray.800"
        p={8}
        rounded="lg"
        shadow="lg"
        maxW="400px"
        width="100%"
        textAlign="center"
      >
        <Heading as="h1" size="lg" mb={4} color="green.400">
          circle
        </Heading>
        <Text mb={6} fontSize="lg" fontWeight="bold" color="gray.300">
          Login to Circle
        </Text>
        <form onSubmit={handleSubmit(handleLogin)}>
          <VStack gap={4} align="stretch">
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                {...register("username")}
                placeholder="Enter your username"
                bg="gray.700"
                border="none"
                color="white"
                _placeholder={{ color: "gray.500" }}
              />
              {errors.username && (
                <Text color="red.400" fontSize="sm">
                  {errors.username.message}
                </Text>
              )}
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                bg="gray.700"
                border="none"
                color="white"
                _placeholder={{ color: "gray.500" }}
              />
              {errors.password && (
                <Text color="red.400" fontSize="sm">
                  {errors.password.message}
                </Text>
              )}
            </FormControl>
            <Box textAlign="right">
              <Link href="/forgot" color="green.400" fontSize="sm">
                Forgot password?
              </Link>
            </Box>
            <Button
              type="submit"
              colorScheme="green"
              bg="green.400"
              _hover={{ bg: "green.500" }}
              w="full"
              // isLoading={loading}
            >
              Login
            </Button>
            {error && (
              <Text color="red.400" fontSize="sm">
                {error}
              </Text>
            )}
          </VStack>
        </form>
        <Box mt={6}>
          <Text fontSize="sm" color="gray.400">
            Don’t have an account yet?{" "}
            <Link href="/" color="green.400">
              Create account
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
