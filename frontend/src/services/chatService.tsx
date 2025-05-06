import io from 'socket.io-client';

let socket: any = null;
const apiUrl = import.meta.env.API_URL;

export const connectChat = (
  token: string | null,
  room: string,
  onMessage: (msg: any) => void,
  onError?: (err: string) => void,
  onAuthenticated?: () => void,
  onRoomJoin?: () => void
) => {
  if (!token) {
    onError?.('Please login first');
    return;
  }

  if (socket && socket.connected) {
    socket.disconnect();
  }

  socket = io(`${apiUrl}`);

  socket.emit('authenticate', token);

  socket.on('authenticated', () => {
    onAuthenticated?.();
    socket.emit('join_room', room);
    onRoomJoin?.();
  });

  socket.on('unauthorized', (data: any) => {
    onError?.(data.message || 'Unauthorized');
  });

  socket.on('chat_message', (msg: any) => {
    onMessage(msg);
  });
};

export const sendMessage = (message: any) => {
  if (socket && socket.connected) {
    socket.emit('chat_message', message);
  } else {
    console.error('Socket is not connected');
  }
};

export const disconnectChat = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default socket;