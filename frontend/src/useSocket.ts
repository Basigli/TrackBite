import { ref, onUnmounted } from 'vue';
import { io, Socket } from 'socket.io-client';
import { useRecipeStore } from './store/recipeStore';
import { useUserStore } from './store/userStore';

let socket: Socket | null = null;
const isConnected = ref(false);

export function useSocket() {
  const recipeStore = useRecipeStore();
  const userStore = useUserStore();
  

  const connect = () => {
    // Prevent multiple connections
    if (socket?.connected) {
      console.log('Socket already connected');
      return socket;
    }

    socket = io('http://localhost:3001', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Connected to recipe feed:', socket?.id);
      isConnected.value = true;
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from recipe feed:', reason);
      isConnected.value = false;
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('recipe:new', (recipe: any) => {
      console.log('New recipe received:', recipe);
      
      if (recipe.authorId !== userStore.user?._id) {
        recipeStore.addCommunityRecipe(recipe);
      }
    });

    socket.on('recipe:deleted', (data: { recipeId: string }) => {
      console.log('Recipe deleted:', data.recipeId);
      recipeStore.removeCommunityRecipe(data.recipeId);
    });

    socket.on('recipe:updated', (updatedRecipe: any) => {
      console.log('Recipe updated:', updatedRecipe);
      
      if (updatedRecipe.authorId === userStore.user?._id) {
        recipeStore.updateOwnRecipe(updatedRecipe);
      } else {
        recipeStore.updateCommunityRecipe(updatedRecipe);
      }

    });

    socket.on('notification', (notification: any) => {
      console.log('Notification received:', notification);
      // Here you can integrate with your notification system
    });

    return socket;
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      isConnected.value = false;
    }
  };

  const emit = (event: string, data?: any) => {
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  };

  // Get the socket instance
  const getSocket = () => socket;

  return {
    connect,
    disconnect,
    emit,
    getSocket,
    isConnected,
  };
}