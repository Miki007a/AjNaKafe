import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import { useEffect, useState } from "react";
import Card from "./Card.jsx";
import BasicTabs from "./Tabs.jsx";
import { Slider, Typography } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import NotificationManager from "./NotificationManager.jsx";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import MatchDialog from "./MatchDialog.jsx";
export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const [recipientId, setRecipientId] = useState(null);
  const [distance, setDistance] = useState(50);
  const [matches,setMatches]= useState([]);
  const [dialogData, setDialogData] = useState(null);

  // Check for user authentication
  if (!token) {
    return <Navigate to="/login" />
  }

  const handleDistanceChange = (event, newValue) => {
    setDistance(newValue);
  };


  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post('/logout')
      .then(() => {
        setUser({});
        setToken(null);
      });
  };

  useEffect(() => {
    // Fetch user data
    axiosClient.get('/user')
      .then(({ data }) => {
        setUser(data);

        axiosClient.get("/matches").then(({ data }) => {
          setMatches(data);
        });

    // Initialize Laravel Echo
    const echo = new Echo({
      broadcaster: 'pusher',
      key: 'ce68b287bd7980a297d5',
      cluster: 'eu',
      forceTLS: true
    });

    // Subscribe to the channel
    const channel = echo.channel(`user.${data.id}`);
    channel.listen('.my-event', function(data) {

      setDialogData(data);
    });

    // Cleanup function to disconnect the Echo instance when the component unmounts
    return () => {
      echo.disconnect();
    };
      });
  }, []); // Empty dependency array ensures this runs once on mount

  const handleRecipientChange = (newRecipientId) => {
    setRecipientId(newRecipientId);
  };

  return (
    <div id="defaultLayout">
      <ToastContainer />
      <NotificationManager />
      <aside className={'background-aside'}>
        <div className="card">
          <Card />
        </div>
        <div className="distance-meter my-3">
          <Typography id="distance-slider" gutterBottom sx={{
            color: '#8b4513',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '10px',
            letterSpacing: '0.5px',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
          }}>
            Set Distance: {distance} km
          </Typography>
          <Slider
            value={distance}
            onChange={handleDistanceChange}
            aria-labelledby="distance-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={100}
            sx={{
              color: '#ffe593',
              '& .MuiSlider-thumb': {
                backgroundColor: '#ffe593',
              },
              '& .MuiSlider-track': {
                backgroundColor: '#ffe593',
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#ffe593',
              }
            }}
          />
        </div>
        <div className='full-width'>
          <BasicTabs userId={user.id} recipientId={recipientId} matches={matches}/>
        </div>
      </aside>
      <div className="content" style={{
        backgroundImage: `url('/coffee-background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        <header className={'header navbar navbar-expand-lg navbar-dark shadow-5-strong'}>
          <div><Link className={'custom-button'} to={'/cards'}>FIND MY MATCH</Link></div>
          <div className={'href-style'}>
            <a onClick={onLogout} className="logout-button " href="#">Logout</a>
          </div>
        </header>
        <main className={"p-0"}>
        <MatchDialog match={dialogData}></MatchDialog>
          <Outlet />
        </main>
        {notification &&
          <div className="notification">
            {notification}
          </div>
        }
      </div>
    </div>
  );
}
