import React, {useEffect, useRef, useState} from 'react';
import { Button, Input, MessageList } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css'; // Ensure to import the CSS for styling
import '../../public/resources/css/Chat.css';
import Echo from 'laravel-echo';
import io from 'socket.io-client';
import AxiosClient from "../axios-client.js";
const ChatApp = () => {
  const inputReference = useRef(); // Create a reference for the input
  const [inputValue, setInputValue] = useState(''); // State for input value
  const [messages, setMessages] = useState([]); // State for message list

  useEffect(() => {


  }, []);

  const inputClear = () => {
    setInputValue(''); // Clear the state value
    if (inputReference.current) {
      inputReference.current.clear(); // Call the clear method of the input reference
    }
  };

  // Handle the change in input
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Function to send a message
  const sendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        position: 'right',
        type: 'text',
        text: inputValue,
        date: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Add the new message to the message list
      inputClear(); // Clear the input after sending the message
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        <div className="chat-header">
          <img src="https://via.placeholder.com/40" alt="Profile" className="profile-picture"/>
          <span className="profile-name">John Doe</span>
        </div>
        <MessageList
          className='message-list'
          lockable={true}
          toBottomHeight={'100%'}
          dataSource={[{
            position: 'right',
            type: 'text',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
            date: new Date(),
            link: '/Chat',

          },
            {
              position: 'left',
              type: 'text',
              text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
              date: new Date(),
              link: '/Chat',
            },
          ]}
        />
        <div className="input-container">
          <Input
            reference={inputReference} // Use the reference
            placeholder='Type here...'
            multiline={true}
            value={inputValue}
            onChange={handleInputChange} // Update state on change
          />
          <Button className={'no-margin-top'} color='white' backgroundColor='black' text='Send' onClick={sendMessage}/>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
