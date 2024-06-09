import React, { useState } from 'react';
import { Button } from '@enact/sandstone/Button';
import { InputField } from '@enact/sandstone/Input';
import Popup from '@enact/sandstone/Popup';
import TabLayout, { Tab } from '@enact/sandstone/TabLayout';
import Region from '@enact/sandstone/Region';
import MediaOverlay from '@enact/sandstone/MediaOverlay';
import axios from 'axios';
import css from './Main.module.less';
import { login as lgin, getMyInfo } from '../hooks/server';
import { data } from 'ilib';
import {useUserStore} from "../zustand"
const API_URL = 'http://3.36.212.250:3000'; // Your API URL 

const MyPage = () => {

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('login'); // 'login' or 'create'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const {user, setUser} = useUserStore();

  const login = async (email, password) => {
    try {
      const userData = await lgin(
        email,
        password
      ).then((token)=>
        getMyInfo(token).then((data)=>{
          setUser({user: data});
          setPopupOpen(false); // Close popup after successful login
        }).catch((e)=>{
          console.log("Err | Mypage.js | login | getMyInfo : ")+e;
        })
      ).catch((e)=>{
        console.log('Invalid email or password : '+e);
      });
    }catch{
      console.log("Err | Mypage.js | login")
    }
  };

  const logout = () => {
    setUser(null);
  };

  const fetchBookmarks = (userId) => {
    // Mock data for bookmarks
    const mockBookmarks = [
      { videoId: '101', title: 'Introduction to React', src: 'https://via.placeholder.com/300?text=React+101' },
      { videoId: '102', title: 'Advanced JavaScript', src: 'https://via.placeholder.com/300?text=JS+Advanced' }
    ];
    // setBookmarks(mockBookmarks);
  };

  const fetchFinishedVideos = (userId) => {
    // Mock data for finished videos
    const mockFinishedVideos = [
      { videoId: '201', title: 'React Hooks Deep Dive', src: 'https://via.placeholder.com/300?text=React+Hooks' },
      { videoId: '202', title: 'State Management with Redux', src: 'https://via.placeholder.com/300?text=Redux' }
    ];
    // setFinishedVideos(mockFinishedVideos);
  };

  const register = async (email, username, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        username,
        password
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateAccount = async () => {
    try {
      const newUser = await register(email, name, password);
      if (newUser) {
        setPopupOpen(false); // Close popup after creating a new user
      }
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };
  return (
    <div className={css.myPage}>
      {user ? (
        <div>
          <div className={css.header}>
            <Region title="My Page" />
            <Button className={css.logoutButton} onClick={logout}>Logout</Button>
          </div>
          <TabLayout>
            <Tab title="My Info">
              <div>
                <h2>My Info</h2>
                <p>Name: {user.username}</p>
                <p>Email: {user.email}</p>
              </div>
            </Tab>
            <Tab title="Bookmarked Videos">
              <div>
                <h2>Bookmarked Videos</h2>
                <div className={css.videoGrid}>
                  
                  { user?.bookMark?.map((bookmark, index) => (
                    <MediaOverlay
                      key={index}
                      src={bookmark.src}
                      caption={bookmark.title}
                      className={css.mediaOverlay}
                    />
                  ))}
                </div>
              </div>
            </Tab>
            <Tab title="Finished Videos">
              <div>
                <h2>Finished Videos</h2>
                <div className={css.videoGrid}>
                  <div>finish video mock div</div>
                  {/* {finishedVideos.map((video, index) => (
                    <MediaOverlay
                      key={index}
                      src={video.src}
                      caption={video.title}
                      className={css.mediaOverlay}
                    />
                  ))} */}
                </div>
              </div>
            </Tab>
          </TabLayout>
        </div>
      ) : (
        <div className={css.mypageButtons}>
          <Button onClick={() => { setPopupType('login'); setPopupOpen(true); }}>Login</Button>
          <Button onClick={() => { setPopupType('create'); setPopupOpen(true); }}>Create Account</Button>
        </div>
      )}

      <Popup open={isPopupOpen} onClose={() => setPopupOpen(false)}>
        {popupType === 'login' ? (
          <>
            <span>Enter your email and password to login</span>
            <div>
              <InputField placeholder="Email" value={email} onChange={({ value }) => setEmail(value)} />
              <InputField placeholder="Password" value={password} onChange={({ value }) => setPassword(value)} type="password" />
            </div>
            <div>
              <Button size="small" className={css.buttonCell} onClick={() => login(email, password)}>
                Login
              </Button>
              <Button size="small" className={css.buttonCell} onClick={() => setPopupOpen(false)}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <span>Enter user details to create an account</span>
            <div>
              <InputField placeholder="Name" value={name} onChange={({ value }) => setName(value)} />
              <InputField placeholder="Email" value={email} onChange={({ value }) => setEmail(value)} />
              <InputField placeholder="Password" value={password} onChange={({ value }) => setPassword(value)} type="password" />
            </div>
            <div>
              <Button size="small" className={css.buttonCell} onClick={handleCreateAccount}>
                Create Account
              </Button>
              <Button size="small" className={css.buttonCell} onClick={() => setPopupOpen(false)}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </Popup>
    </div>
  );
};

export default MyPage;