import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { ChatList } from 'react-chat-elements';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'react-chat-elements/dist/main.css';
import '../../public/resources/css/tabs.css';
import { Hearts } from 'react-loader-spinner'; // Loader
import { useStateContext } from "../context/ContextProvider.jsx";
import AxiosClient from "../axios-client.js";
import Echo from 'laravel-echo';
import io from 'socket.io-client';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ userId, recipientId, matches }) {
  const { user } = useStateContext();
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [power, setPower] = useState(0);
  useEffect(() => {
    // Simulate loading time for data fetching
    setTimeout(() => {
      setLoading(false); // Simulate data being fetched after 2 seconds
    }, 3000);



    const socket = io('http://localhost:6001');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Listen for the event from the backend
    socket.on('test-channel:App\\Events\\TestBroadcast', (message) => {
      console.log('Message received:', message);
      // Update the power state when a new message is received
      setPower(prevPower => prevPower + parseInt(message.power));
    });

    // Cleanup the connection when the component is unmounted
    return () => {
      socket.disconnect();
    };

  }, []);

  const handleChatClick = (chat) => {
    navigate(chat.link);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{width: '100%'}}>
      <Box x={{borderBottom: 1, borderColor: 'divider'}}>
        <div className="centered">
          <Tabs
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#ffe593',
              },
              '& .Mui-selected': {
                color: '#ffe593',
                borderColor: '#ffe593', // Custom text color for selected tab
              },
            }}
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab className="btn draw-border" label="Matches" {...a11yProps(0)} />
            <Tab className="btn draw-border" label="Messages" {...a11yProps(1)} />
          </Tabs>
        </div>
      </Box>
      <p>Power: {power}</p>
      {/* Loader */}
      {loading ? (
        <CustomTabPanel value={value} index={0}>
          <div className="card-match">
            <Hearts
              height="150"
              width="200"
              color="#f5deb3"
              ariaLabel="hearts-loading"
              visible={true}
            />
          </div>
        </CustomTabPanel>
      ) : (
        <>
          {/* Matches Tab */}
          <CustomTabPanel value={value} index={0}>
            {matches.length > 0 ? (
              matches.map((match) => {
                const usera = match.user1.id !== user.id ? match.user1 : match.user2;
                return (
                  <div className="card-match" key={match.id}>
                    <img
                      src={`http://localhost:8000/storage/${usera.profile_picture}`}
                      alt={usera.name}
                    />
                    <span className="name">{usera.name}</span>
                  </div>
                );
              })
            ) : (
              <p>No matches available.</p>
            )}
          </CustomTabPanel>

          {/* Messages Tab */}
          <CustomTabPanel value={value} index={1}>
            <ChatList
              className="chat-list"
              dataSource={[
                {
                  avatar: '/coffe-header.png',
                  alt: 'Reactjs',
                  title: 'Facebook',
                  subtitle: 'What are you doing?',
                  date: new Date(),
                  unread: 0,
                  link: '/Chat',
                },
                {
                  avatar: '/coffe-header.png',
                  alt: 'Reactjs',
                  title: 'Facebook',
                  subtitle: 'What are you doing?',
                  date: new Date(),
                  unread: 0,
                  link: '/Chat',
                },
              ]}
              onClick={handleChatClick}
            />
          </CustomTabPanel>
        </>
      )}
    </Box>
  );
}
