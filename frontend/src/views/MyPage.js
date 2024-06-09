import React, { useState } from 'react';
import { Button } from '@enact/sandstone/Button';
import { InputField } from '@enact/sandstone/Input';
import Popup from '@enact/sandstone/Popup';
import TabLayout, { Tab } from '@enact/sandstone/TabLayout';
import Region from '@enact/sandstone/Region';
import css from './Main.module.less';

const MyPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: 'Peter', sex: 'Male', age: 30, email: 'peter@example.com' },
    { id: 2, name: 'Anna', sex: 'Female', age: 25, email: 'anna@example.com' }
  ]);
  const [currentUser, setCurrentUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [finishedVideos, setFinishedVideos] = useState([]); // New state for finished videos

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserSex, setNewUserSex] = useState('');
  const [newUserAge, setNewUserAge] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const login = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    fetchBookmarks(user.id);
    fetchFinishedVideos(user.id); // Fetch finished videos when logging in
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setBookmarks([]);
    setFinishedVideos([]); // Clear finished videos on logout
  };

  const fetchBookmarks = (userId) => {
    fetch(`/api/users/${userId}/bookmarks`)
      .then((response) => response.json())
      .then((data) => {
        setBookmarks(data.bookmarks);
      });
  };

  const fetchFinishedVideos = (userId) => { // New function to fetch finished videos
    fetch(`/api/users/${userId}/finished-videos`)
      .then((response) => response.json())
      .then((data) => {
        setFinishedVideos(data.finishedVideos);
      });
  };

  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      name: newUserName,
      sex: newUserSex,
      age: parseInt(newUserAge),
      email: newUserEmail
    };
    setUsers([...users, newUser]);
    setNewUserName('');
    setNewUserSex('');
    setNewUserAge('');
    setNewUserEmail('');
    setPopupOpen(false);
  };

  return (
    <div className={css.myPage}>
      {isLoggedIn && currentUser ? (
        <div>
          <div className={css.header}>
            <Region title="My Page" />
            <Button className={css.logoutButton} onClick={logout}>Logout</Button>
          </div>
          <TabLayout>
            <Tab title="My Info">
              <div>
                <h2>My Info</h2>
                <p>Name: {currentUser.name}</p>
                <p>Sex: {currentUser.sex}</p>
                <p>Age: {currentUser.age}</p>
                <p>Email: {currentUser.email}</p>
              </div>
            </Tab>
            <Tab title="Bookmarked Videos">
              <div>
                <h2>Bookmarked Videos</h2>
                <ul>
                  {bookmarks.map((bookmark, index) => (
                    <li key={index}>Video ID: {bookmark}</li>
                  ))}
                </ul>
              </div>
            </Tab>
            <Tab title="Finished Videos">
              <div>
                <h2>Finished Videos</h2>
                <ul>
                  {finishedVideos.map((video, index) => (
                    <li key={index}>Video ID: {video}</li>
                  ))}
                </ul>
              </div>
            </Tab>
          </TabLayout>
        </div>
      ) : (
        <div>
          {users.map((user, index) => (
            <Button key={index} onClick={() => login(user)}>
              Login as {user.name}
            </Button>
          ))}
          <Button onClick={() => setPopupOpen(true)}>Add User</Button>
        </div>
      )}

      <Popup open={isPopupOpen} onClose={() => setPopupOpen(false)}>
        <span>Enter user details</span>
        <div>
          <InputField placeholder="Name" value={newUserName} onChange={({ value }) => setNewUserName(value)} />
          <InputField placeholder="Sex" value={newUserSex} onChange={({ value }) => setNewUserSex(value)} />
          <InputField placeholder="Age" value={newUserAge} onChange={({ value }) => setNewUserAge(value)} />
          <InputField placeholder="Email" value={newUserEmail} onChange={({ value }) => setNewUserEmail(value)} />
        </div>
        <div>
          <Button size="small" className={css.buttonCell} onClick={handleAddUser}>
            Add User
          </Button>
          <Button size="small" className={css.buttonCell} onClick={() => setPopupOpen(false)}>
            Cancel
          </Button>
        </div>
      </Popup>
    </div>
  );
};

export default MyPage;