class ChatService {
    constructor(messageCallback) {
      this.messageCallback = messageCallback;
      this.currentRoom = null;
      this.mockServer = new MockChatServer(messageCallback);
      this.chatRooms = [
        { id: 'general', name: 'General Chat', users: 23 },
        { id: 'tech', name: 'Tech Talk', users: 14 },
        { id: 'random', name: 'Random Stuff', users: 8 }
      ];
    }
    
    handleCommand(params) {
      if (!params || params.length === 0) {
        this.messageCallback('Usage: chat <command> [options]', 'error');
        this.messageCallback('Available commands: list, join, leave, send, users', 'system');
        return;
      }
      
      const command = params[0].toLowerCase();
      
      switch (command) {
        case 'list':
          this.listRooms();
          break;
        case 'join':
          if (params.length < 2) {
            this.messageCallback('Usage: chat join <room_id>', 'error');
            return;
          }
          this.joinRoom(params[1]);
          break;
        case 'leave':
          this.leaveRoom();
          break;
        case 'send':
          if (params.length < 2) {
            this.messageCallback('Usage: chat send <message>', 'error');
            return;
          }
          const message = params.slice(1).join(' ');
          this.sendMessage(message);
          break;
        case 'users':
          this.listUsers();
          break;
        default:
          this.messageCallback(`Unknown chat command: ${command}. Try "chat" for available commands.`, 'error');
      }
    }
    
    listRooms() {
      const roomList = this.chatRooms.map(room => 
        `${room.id} - ${room.name} (${room.users} users)`
      ).join('\n');
      
      this.messageCallback(`Available Chat Rooms:\n${roomList}`, 'system');
      this.messageCallback('Use "chat join <room_id>" to join a room.', 'system');
    }
    
    joinRoom(roomId) {
      const room = this.chatRooms.find(r => r.id.toLowerCase() === roomId.toLowerCase());
      
      if (!room) {
        this.messageCallback(`Error: Chat room '${roomId}' not found.`, 'error');
        this.messageCallback('Use "chat list" to see available rooms.', 'system');
        return;
      }
      
      this.messageCallback(`Joining chat room: ${room.name}...`, 'system');
      
      // Simulate connection delay
      setTimeout(() => {
        this.currentRoom = room;
        this.messageCallback(`Joined ${room.name} successfully!`, 'success');
        this.messageCallback(`There are currently ${room.users} users in this room.`, 'system');
        
        // Connect to mock server for this room
        this.mockServer.connect(room.id);
        
        // Play room join sound
        const audio = new Audio('/sounds/room-join.mp3');
        audio.volume = 0.2;
        audio.play().catch(e => console.log('Audio play prevented:', e));
      }, 1000);
    }
    
    leaveRoom() {
      if (!this.currentRoom) {
        this.messageCallback('Error: You are not currently in any chat room.', 'error');
        return;
      }
      
      const roomName = this.currentRoom.name;
      this.messageCallback(`Leaving ${roomName}...`, 'system');
      
      // Disconnect from mock server
      this.mockServer.disconnect();
      
      setTimeout(() => {
        this.currentRoom = null;
        this.messageCallback(`Left ${roomName} successfully.`, 'success');
        
        // Play room leave sound
        const audio = new Audio('/sounds/room-leave.mp3');
        audio.volume = 0.2;
        audio.play().catch(e => console.log('Audio play prevented:', e));
      }, 500);
    }
    
    sendMessage(message) {
      if (!this.currentRoom) {
        this.messageCallback('Error: You are not currently in any chat room. Use "chat join <room_id>" first.', 'error');
        return;
      }
      
      this.mockServer.sendMessage(message);
    }
    
    listUsers() {
      if (!this.currentRoom) {
        this.messageCallback('Error: You are not currently in any chat room.', 'error');
        return;
      }
      
      this.mockServer.listUsers();
    }
  }
  
  // Mock server implementation for demonstration
  class MockChatServer {
    constructor(messageCallback) {
      this.messageCallback = messageCallback;
      this.connected = false;
      this.currentRoom = null;
      this.mockUsers = {
        general: ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward'],
        tech: ['Geek1337', 'CodeWizard', 'TechGuru', 'DevOps4Life'],
        random: ['Meme_Lord', 'RandomPerson', 'JustHere4Fun']
      };
    }
    
    connect(roomId) {
      this.connected = true;
      this.currentRoom = roomId;
      
      // Simulate incoming messages after a delay
      setTimeout(() => {
        this.receiveMessage();
      }, 3000);
    }
    
    disconnect() {
      this.connected = false;
      this.currentRoom = null;
    }
    
    sendMessage(message) {
      if (!this.connected) return;
      
      // Display user message
      this.messageCallback(`You: ${message}`, 'chat-outgoing');
      
      // Simulate response after a short delay
      setTimeout(() => {
        this.receiveMessage();
      }, 1500 + Math.random() * 3000);
    }
    
    receiveMessage() {
      if (!this.connected) return;
      
      const users = this.mockUsers[this.currentRoom] || ['Anonymous'];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      const messages = [
        'Hello there!',
        'Anyone here know about terminal design?',
        'I\'m loving this retro interface!',
        'Has anyone tried the lolcat command yet?',
        'This reminds me of the old BBS days.',
        'ASCII art is underrated.',
        'Check out my GitHub repo for more terminal tools.',
        'Who else is accessing this from a real terminal?',
        'The Matrix has you...',
        'Is this thing on?'
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      // Display received message
      this.messageCallback(`${randomUser}: ${randomMessage}`, 'chat-incoming');
      
      // Play message notification sound
      const audio = new Audio('/sounds/message-received.mp3');
      audio.volume = 0.1;
      audio.play().catch(e => console.log('Audio play prevented:', e));
      
      // 50% chance to receive another message later
      if (Math.random() > 0.5) {
        setTimeout(() => {
          this.receiveMessage();
        }, 5000 + Math.random() * 10000);
      }
    }
    
    listUsers() {
      if (!this.connected || !this.currentRoom) return;
      
      const users = this.mockUsers[this.currentRoom] || [];
      const userList = users.join('\n');
      
      this.messageCallback(`Users in this room:\nYou (you)\n${userList}`, 'system');
    }
  }
  
  export default ChatService;