import { create } from 'zustand';

export const profileStore = create((set) => ({
  user: null || "",
  suggestedUsers: [],
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setSuggestedUsers: (users) => set({ suggestedUsers: users }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
