import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// Define User interface
interface User {
  fullname: string;
  email: string;
  username: string;
  bio: string;
  avatar: string;
  image: string;
}

// Define UserContext value
interface UserContextType {
  user: User; // Make user always defined
  setUser: (user: User) => void; // setUser always expects a user
  logout: () => void; // Additional logout function
}

// Create UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook to use UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Fetch user data function
const fetchUserData = async (token: string): Promise<User | null> => {
  try {
    const response = await axios.get("http://localhost:3000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Fetched user data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// Define a default user object with empty values
const defaultUser: User = {
  fullname: "",
  email: "",
  username: "",
  bio: "",
  avatar: "",
  image: "",
};

// UserProvider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser); // Use defaultUser instead of null

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchUserData(token)
        .then((userData) => {
          if (userData) {
            setUser(userData);
          } else {
            console.warn("No user data found.");
            localStorage.removeItem("token"); // Clear invalid token
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("token"); // Clear invalid token on error
        });
    }
  }, []);

  const updateUser = (userData: User) => {
    setUser(userData);
    if (userData.fullname === "") {
      localStorage.removeItem("token"); // Clear token if user is empty
    }
  };

  const logout = () => {
    setUser(defaultUser); // Reset to defaultUser on logout
    localStorage.removeItem("token"); // Clear token on logout
    console.log("User logged out.");
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
