import React, { useState } from "react";
import {
  Box,
  Input,
  Text,
  Center,
  Flex,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { IoSearchOutline } from "react-icons/io5";
import { Avatar } from "@/components/ui/avatar"
import {jwtDecode} from "jwt-decode";

function SearchPage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const token = localStorage.getItem("token")
  const decodedToken = jwtDecode(token); // Ensure your token contains the userId
  const currentUserId = decodedToken.id;
  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/users/search?query=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const filteredResults = data.filter((user) => user.id !== currentUserId);
        setResults(filteredResults);
        // setResults(data);
      } else {
        console.error("Failed to fetch search results.");
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  };

  

  const toggleFollow = async (userId) => {
    try {
      // const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token); // Ensure your token contains the userId
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
      handleSearch(); // Refresh search results
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };


  return (
    <Box color="white" minH="100vh" p={5}>
      {/* Search Bar */}
      <Center>
        <Flex w="full" bg="gray.800" borderRadius="full" alignItems="center" p={2} mb={10}>
          <IoSearchOutline />
          <Input
            placeholder="Search your friend"
            ml={4}
            _placeholder={{ color: "gray.500" }}
            flex="1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button onClick={handleSearch} ml={2} colorScheme="blue">
            Search
          </Button>
        </Flex>
      </Center>

      {/* Loading Spinner */}
      {loading && (
        <Center mt={10}>
          <Spinner size="lg" />
        </Center>
      )}

      {/* Search Results */}
      <Box mt={10}>
        {results.map((user) => (
          <Flex key={user.id} p={4} align="center" bg="gray.800" borderRadius="md" mb={4}>
            <Avatar src={user.profile_pic} name={user.username} />
            <Box ml={4} flex="1">
              <Text fontWeight="bold">{user.username}</Text>
              <Text fontSize="sm" color="gray.400">
                {user.fullname || "No name provided"}
              </Text>
            </Box>
            <Button colorScheme="blue" onClick={() => toggleFollow(user.id)}>
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </Flex>
        ))}
      </Box>

      {/* No Results Message */}
      {!loading && results.length === 0 && query.trim() && (
        <Center flexDir="column" mt={20}>
          <Text fontSize="xl" fontWeight="bold">
            No results found
          </Text>
          <Text fontSize="md" color="gray.400" mt={2} textAlign="center">
            Try searching for something else or check the spelling of what you typed.
          </Text>
        </Center>
      )}
    </Box>
  );
}

export default SearchPage;



// import {
//   Box,
//   Button,
//   Input,
//   Text,
// } from '@chakra-ui/react';
// import { useState, useEffect } from 'react';
// import { UsersType } from '../types/users.types';
// import { Avatar } from '@/components/ui/avatar';
// import { api } from '../libs/api';

// function SearchPage() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState<UsersType[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         const response = await api.get('/users');
//         setSearchResults(response.data);
//       } catch (err) {
//         setError('Failed to fetch users');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleFollow = async (userId: number, isFollowed: boolean) => {
//     try {
//       setLoading(true);
//       const response = isFollowed
//         ? await api.post(`/unfollow/${userId}`) 
//         : await api.post(`/follow/${userId}`); 

//       if (response.data.success) {
//         setSearchResults((prev) =>
//           prev.map((user) =>
//             user.id === userId ? { ...user, isFollowed: !isFollowed } : user
//           )
//         );
//       }
//     } catch (error) {
//       setError('Failed to update follow status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredResults = searchResults.filter((user) =>
//     user.username.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box margin="30px">
//       <Input
//         placeholder="Search your friend"
//         backgroundColor="brand.secondary.800"
//         color="white"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       {loading ? (
//         <Text color="white">Loading...</Text>
//       ) : error ? (
//         <Text color="red.500">{error}</Text>
//       ) : !searchTerm ? (
//         <Box
//           w="100%"
//           h="500px"
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//         >
//           <Text color="white">Type a username to search</Text>
//         </Box>
//       ) : filteredResults.length === 0 ? (
//         <Box
//           w="100%"
//           h="500px"
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           flexDirection="column"
//           textAlign="center"
//         >
//           <Text fontWeight="bold" fontSize="lg" color="white">
//             No results for "{searchTerm}"
//           </Text>
//           <Text color="brand.secondary.500">
//             Try searching for something else or check the spelling.
//           </Text>
//         </Box>
//       ) : (
//         <Box>
//           {filteredResults.map((user) => (
//             <Box display="flex" marginTop="20px" key={user.id}>
//               <Box flex="1">
//                 <Avatar src={user.profilePicture} />
//               </Box>
//               <Box flex="8">
//                 <Text color="white">{user.fullName}</Text>
//                 <Text color="brand.secondary.400">@{user.username}</Text>
//                 <Text color="white">{user.profile.bio}</Text>
//               </Box>
//               <Button
//                 onClick={() =>
//                   handleFollow(Number(user.id), user.isFollowed)
//                 }
//                 variant="outline"
//                 color="white"
//                 flex="1"
//                 disabled={loading}
//               >
//                 {user.isFollowed ? 'Following' : 'Follow'}
//               </Button>
//             </Box>
//           ))}
//         </Box>
//       )}
//     </Box>
//   );
// }

// export default SearchPage