import { useState, useEffect } from 'react';
import { sendMessage, getMessages, subscribeToMessages } from '../lib/appwrite/chat';
import type { Message } from '../types/chat';
import { useAuth } from '../contexts/AuthContext';

export function useChat(otherUserId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!user) return;
    console.log("otheruser", otherUserId);
    
    const loadMessages = async () => {
      try {
        const response = await getMessages(user.$id, otherUserId);
        setMessages(response.documents as Message[]);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Subscribe to new messages
    const unsubscribe = subscribeToMessages(user.$id, (newMessage) => {
      console.log("New message received:", newMessage); // Debugging log
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      unsubscribe();
    };
  }, [user, otherUserId]);

  const sendNewMessage = async (content: string) => {
    if (!user) return;

    try {
      await sendMessage({
        senderId: user.$id,
        receiverId: otherUserId,
        content,
        isRead: false,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return {
    messages,
    loading,
    sendMessage: sendNewMessage,
  };
}