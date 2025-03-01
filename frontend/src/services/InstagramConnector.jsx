class InstagramConnector {
    constructor(messageCallback) {
      this.messageCallback = messageCallback;
      this.isConnected = false;
      this.followers = [
        { id: '1', username: 'user123', name: 'User One' },
        { id: '2', username: 'design_lover', name: 'Design Enthusiast' },
        { id: '3', username: 'tech_geek', name: 'Tech Geek' }
      ];
    }
    
    handleCommand(params) {
      if (!params || params.length === 0) {
        this.messageCallback('Usage: insta <command> [options]', 'error');
        this.messageCallback('Available commands: connect, status, followers, dm', 'system');
        return;
      }
      
      const command = params[0].toLowerCase();
      
      switch (command) {
        case 'connect':
          this.connect();
          break;
        case 'status':
          this.status();
          break;
        case 'followers':
          this.listFollowers();
          break;
        case 'dm':
          if (params.length < 3) {
            this.messageCallback('Usage: insta dm <user> <message>', 'error');
            return;
          }
          const user = params[1];
          const message = params.slice(2).join(' ');
          this.sendDM(user, message);
          break;
        default:
          this.messageCallback(`Unknown Instagram command: ${command}. Try "insta" for available commands.`, 'error');
      }
    }
    
    connect() {
      // In a real application, this would handle Instagram API authorization
      this.messageCallback('Connecting to Instagram...', 'system');
      
      // Simulate connection process
      setTimeout(() => {
        this.messageCallback('Verifying credentials...', 'system');
      }, 500);
      
      setTimeout(() => {
        this.messageCallback('Fetching profile data...', 'system');
      }, 1500);
      
      // Simulate connection success
      setTimeout(() => {
        this.isConnected = true;
        this.messageCallback('Connected to Instagram successfully!', 'success');
        
        // Play notification sound
        const audio = new Audio('/sounds/notification.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play prevented:', e));
      }, 2500);
    }
    
    status() {
      if (this.isConnected) {
        this.messageCallback('Instagram: Connected', 'success');
      } else {
        this.messageCallback('Instagram: Not connected. Use "insta connect" first.', 'error');
      }
    }
    
    listFollowers() {
      if (!this.isConnected) {
        this.messageCallback('Error: Not connected to Instagram. Use "insta connect" first.', 'error');
        return;
      }
      
      const followerList = this.followers.map(follower => 
        `@${follower.username} (${follower.name})`
      ).join('\n');
      
      this.messageCallback(`Instagram Followers:\n${followerList}`, 'system');
    }
    
    sendDM(user, message) {
      if (!this.isConnected) {
        this.messageCallback('Error: Not connected to Instagram. Use "insta connect" first.', 'error');
        return;
      }
      
      // Check if user is a valid follower
      const follower = this.followers.find(f => 
        f.username.toLowerCase() === user.toLowerCase().replace('@', '') || 
        f.name.toLowerCase() === user.toLowerCase()
      );
      
      if (follower) {
        this.messageCallback(`Sending Instagram DM to @${follower.username}:`, 'system');
      } else {
        this.messageCallback(`Sending Instagram DM to ${user}:`, 'system');
      }
      
      this.messageCallback(`"${message}"`, 'default');
      
      // Simulate sending process
      setTimeout(() => {
        const recipient = follower ? `@${follower.username}` : user;
        this.messageCallback(`DM sent to ${recipient} successfully!`, 'success');
        
        // Play message sent sound
        const audio = new Audio('/sounds/message-sent.mp3');
        audio.volume = 0.2;
        audio.play().catch(e => console.log('Audio play prevented:', e));
      }, 1500);
    }
  }
  
  export default InstagramConnector;