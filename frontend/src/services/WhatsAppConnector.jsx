class WhatsAppConnector {
    constructor(messageCallback) {
      this.messageCallback = messageCallback;
      this.isConnected = false;
      this.contacts = [
        { id: '1', name: 'Alice', number: '+1234567890' },
        { id: '2', name: 'Bob', number: '+0987654321' },
        { id: '3', name: 'Charlie', number: '+1122334455' }
      ];
    }
    
    handleCommand(params) {
      if (!params || params.length === 0) {
        this.messageCallback('Usage: whatsapp <command> [options]', 'error');
        this.messageCallback('Available commands: connect, status, send, contacts', 'system');
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
        case 'contacts':
          this.listContacts();
          break;
        case 'send':
          if (params.length < 3) {
            this.messageCallback('Usage: whatsapp send <to> <message>', 'error');
            return;
          }
          const to = params[1];
          const message = params.slice(2).join(' ');
          this.sendMessage(to, message);
          break;
        default:
          this.messageCallback(`Unknown WhatsApp command: ${command}. Try "whatsapp" for available commands.`, 'error');
      }
    }
    
    connect() {
      // In a real application, this would handle the WhatsApp API authorization
      this.messageCallback('Connecting to WhatsApp...', 'system');
      
      // Simulate connection process with typing effect
      setTimeout(() => {
        this.messageCallback('Authenticating...', 'system');
      }, 500);
      
      setTimeout(() => {
        this.messageCallback('Syncing contacts...', 'system');
      }, 1500);
      
      // Simulate connection success
      setTimeout(() => {
        this.isConnected = true;
        this.messageCallback('Connected to WhatsApp successfully!', 'success');
        
        // Play notification sound
        const audio = new Audio('/sounds/notification.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play prevented:', e));
      }, 2500);
    }
    
    status() {
      if (this.isConnected) {
        this.messageCallback('WhatsApp: Connected', 'success');
      } else {
        this.messageCallback('WhatsApp: Not connected. Use "whatsapp connect" first.', 'error');
      }
    }
    
    listContacts() {
      if (!this.isConnected) {
        this.messageCallback('Error: Not connected to WhatsApp. Use "whatsapp connect" first.', 'error');
        return;
      }
      
      const contactList = this.contacts.map(contact => 
        `${contact.name} (${contact.number})`
      ).join('\n');
      
      this.messageCallback(`WhatsApp Contacts:\n${contactList}`, 'system');
    }
    
    sendMessage(to, message) {
      if (!this.isConnected) {
        this.messageCallback('Error: Not connected to WhatsApp. Use "whatsapp connect" first.', 'error');
        return;
      }
      
      // Check if to is a valid contact
      const contact = this.contacts.find(c => 
        c.name.toLowerCase() === to.toLowerCase() || 
        c.number === to
      );
      
      if (contact) {
        this.messageCallback(`Sending WhatsApp message to ${contact.name} (${contact.number}):`, 'system');
      } else {
        this.messageCallback(`Sending WhatsApp message to ${to}:`, 'system');
      }
      
      this.messageCallback(`"${message}"`, 'default');
      
      // Simulate sending process
      setTimeout(() => {
        const recipient = contact ? contact.name : to;
        this.messageCallback(`Message sent to ${recipient} successfully!`, 'success');
        
        // Play message sent sound
        const audio = new Audio('/sounds/message-sent.mp3');
        audio.volume = 0.2;
        audio.play().catch(e => console.log('Audio play prevented:', e));
      }, 1500);
    }
  }
  
  export default WhatsAppConnector;