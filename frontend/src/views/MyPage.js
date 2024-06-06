import React, { useState } from 'react';
import { Button } from '@enact/sandstone/Button';
import { InputField } from '@enact/sandstone/Input';
import Popup from '@enact/sandstone/Popup';
import css from './Main.module.less';
import Region from '@enact/sandstone/Region';

const MyPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([
    { name: 'Peter', sex: 'Male', age: 30, email: 'peter@example.com' },
    { name: 'Anna', sex: 'Female', age: 25, email: 'anna@example.com' }
  ]);
  const [currentUser, setCurrentUser] = useState(null);

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserSex, setNewUserSex] = useState('');
  const [newUserAge, setNewUserAge] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const login = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const handleAddUser = () => {
    const newUser = { name: newUserName, sex: newUserSex, age: parseInt(newUserAge), email: newUserEmail };
    setUsers([...users, newUser]);
    setNewUserName('');
    setNewUserSex('');
    setNewUserAge('');
    setNewUserEmail('');
    setPopupOpen(false);
  };

  return (
    <div className={css.myPage}>
      <Region title="My Page" />
      {isLoggedIn && currentUser ? (
        <div>
          <Button onClick={logout}>Logout</Button>
          <div>
            <h2>My Info</h2>
            <p>Name: {currentUser.name}</p>
            <p>Sex: {currentUser.sex}</p>
            <p>Age: {currentUser.age}</p>
            <p>Email: {currentUser.email}</p>
          </div>
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