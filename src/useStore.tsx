// import { create } from 'zustand';

// interface User {
//   email: string;
//   username: string;
//   avatar: string;
//   bio: string;
//   loggedIn: boolean;
// }

// interface LikeState {
//   likedItems: Set<string>;
//   toggleLike: (itemId: string) => void;
// }

// interface Store {
//   user: User | null;
//   setUser: (user: User | null) => void;
//   likeState: LikeState;
// }

// export const useStore = create<Store>((set) => ({
//   user: null,
//   setUser: (user) => set({ user }),

//   likeState: {
//     likedItems: new Set(),
//     toggleLike: (itemId) =>
//       set((state) => {
//         const likedItems = new Set(state.likeState.likedItems);
//         if (likedItems.has(itemId)) {
//           likedItems.delete(itemId);
//         } else {
//           likedItems.add(itemId);
//         }
//         // Return the updated likeState while preserving the toggleLike method
//         return {
//           likeState: {
//             ...state.likeState,
//             likedItems,
//           },
//         };
//       }),
//   },
// }));


// import {create} from 'zustand';

// interface LikeState {
//   likedItems: Set<number>;
//   toggleLike: (id: number) => void;
//   getLikes: (id: number) => number;
// }

// export interface Post {
//   id: number;
//   username: string,
//   handle: string,
//   time: string,
//   content: string,
//   avatar: string,
//   likes: number,
//   isLiked: boolean,
//   replies: number,
//   image: string, 
// }

// interface Store {
//   posts: Post[];
//   likeState: LikeState;
// }

// export const useStore = create<Store>((set, get) => ({
//   posts: [], // Optionally preload posts globally here if needed
//   likeState: {
//     likedItems: new Set(),
//     toggleLike: (id: number) => {
//       const { likedItems } = get().likeState;
//       const updatedLikedItems = new Set(likedItems);
//       const isLiked = likedItems.has(id);

//       if (isLiked) {
//         updatedLikedItems.delete(id);
//       } else {
//         updatedLikedItems.add(id);
//       }

//       set({
//         likeState: {
//           ...get().likeState,
//           likedItems: updatedLikedItems,
//         },
//       });
//     },
//     getLikes: (id: number) => {
//       const isLiked = get().likeState.likedItems.has(id);
//       const post = get().posts.find((post) => post.id === id);
//       return isLiked && post ? post.likes + 1 : post?.likes || 0;
//     },
//   },
// }));


import { create } from "zustand";

// Post interface
export interface Post {
  id: number;
  username: string;
  handle: string;
  time: string;
  content: string;
  avatar: string;
  likes: number;
  isLiked: boolean;
  replies: number;
  image: string;
}

// LikeState interface
interface LikeState {
  likedItems: Set<number>; // Stores the IDs of liked posts
  toggleLike: (id: number) => void; // Toggles the like state of a post
  getLikes: (id: number) => number; // Returns the number of likes for a post
}

// Store interface
interface Store {
  posts: Post[]; // List of posts
  setPosts: (posts: Post[]) => void; // Function to set posts
  likeState: LikeState; // Like state management
}

// Helper functions for localStorage
const loadPosts = (): Post[] => {
  const savedPosts = localStorage.getItem("posts");
  const likedItems = loadLikedItems();
  const posts = savedPosts ? JSON.parse(savedPosts) : [];
  return posts.map((post: Post) => ({
    ...post,
    isLiked: likedItems.has(post.id), // Sync like state with likedItems
  }));
};

const savePosts = (posts: Post[]) => {
  localStorage.setItem("posts", JSON.stringify(posts));
};

const loadLikedItems = (): Set<number> => {
  const savedLikes = localStorage.getItem("likedItems");
  return savedLikes ? new Set(JSON.parse(savedLikes)) : new Set();
};

const saveLikedItems = (likedItems: Set<number>) => {
  localStorage.setItem("likedItems", JSON.stringify([...likedItems]));
};

// Create the Zustand store
export const useStore = create<Store>((set, get) => ({
  posts: loadPosts(), // Load posts from localStorage on initialization

  setPosts: (posts: Post[]) => {
    const likedItems = get().likeState.likedItems;
    const updatedPosts = posts.map((post) => ({
      ...post,
      isLiked: likedItems.has(post.id), // Sync isLiked with likedItems
    }));

    savePosts(updatedPosts); // Save posts to localStorage
    set({ posts: updatedPosts });
  },

  likeState: {
    likedItems: loadLikedItems(), // Load likedItems from localStorage on initialization

    toggleLike: (id: number) => {
      set((state) => {
        const likedItems = new Set(state.likeState.likedItems); // Copy current liked items
        const posts = state.posts.map((post) => {
          if (post.id === id) {
            const isLiked = likedItems.has(id);
            if (isLiked) {
              likedItems.delete(id); // Unlike the post
            } else {
              likedItems.add(id); // Like the post
            }
            return {
              ...post,
              isLiked: !isLiked,
              likes: isLiked ? post.likes - 1 : post.likes + 1, // Update like count
            };
          }
          return post;
        });

        saveLikedItems(likedItems); // Save liked items to localStorage
        savePosts(posts); // Save posts to localStorage

        return {
          likeState: {
            ...state.likeState,
            likedItems,
          },
          posts,
        };
      });
    },

    getLikes: (id: number) => {
      const post = get().posts.find((post) => post.id === id);
      return post ? post.likes : 0;
    },
  },
}));



