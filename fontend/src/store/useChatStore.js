import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInsert } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInsert.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId) return; // Prevents calling API with undefined userId

    set({ isMessagesLoading: true });
    try {
      const res = await axiosInsert.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    try {
      const res = await axiosInsert.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      // ✅ Instantly update messages state without refresh
      set({ messages: [...messages, res.data] });

      // ✅ Emit the message to Socket.io for real-time update
      const socket = useAuthStore.getState().socket;
      if (!socket || !socket.connected) {
        console.error("Socket is not initialized or not connected");
        return;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket || !socket.connected) {
      console.error("Socket is not initialized or not connected");
      return;
    }

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });

    // ✅ Also listen for messages sent by the current user
    socket.on("messageSent", (sentMessage) => {
      set((state) => ({
        messages: [...state.messages, sentMessage],
      }));
    });
  },

  unsubscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
