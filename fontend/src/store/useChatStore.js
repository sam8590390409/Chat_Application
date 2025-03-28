import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInsert } from "../lib/axios";

export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,  // Fixed camelCase
  isUsersLoading: false,
  isMessagesLoading: false, // Added for message loading state

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInsert.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.messages || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {  // Fixed function name
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInsert.get(`/messages/${userId}`);
      set({ messages: res.data });  // Fixed key name
    } catch (error) {
      toast.error(error.response?.data?.messages || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });  // Fixed key
    }
  },

  sendMessage: async (messageData)=>{
    const {selectedUser,messages} =get()
    try{
        const res =await axiosInsert.post(`/messages/send/${selectedUser._id}`,messageData);
        set({messages:[...messages,res.data]})
    } catch (error) {
        toast.error(error.response?.data?.messages || "Failed to fetch messages");
    }
  },


  setSelectedUser: (selectedUser) => set({ selectedUser }),  // Fixed case issue
}));
