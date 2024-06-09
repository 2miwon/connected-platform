/* eslint-disable */

import VideoPlayer from '@enact/sandstone/VideoPlayer';
import { MediaControls } from '@enact/sandstone/MediaPlayer';
import Button from '@enact/sandstone/Button';

import Popup from '@enact/sandstone/Popup';
import RadioItem from '@enact/sandstone/RadioItem';
import {InputField} from '@enact/sandstone/Input';

import React, { useState, useRef, useEffect } from 'react';

import css from './Main.module.less';

const Video = (prop) => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [isListPopupOpen, setListPopupOpen] = useState(false);
  const [isSpeedPopupOpen, setSpeedPopupOpen] = useState(false);
  const [isBigplayer, setIsBigplayer] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);


  const videoRef = useRef(null);
  //const currentVideoId = videoIdList[selectedOption];

  const handleBookmark = () => {
    const newBookmarkedStatus = !bookmarked;
    setBookmarked(newBookmarkedStatus);

    // Update bookmark status on the server
    fetch(`/api/videos/${prop.videoId}/bookmark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookmarked: newBookmarkedStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        setBookmarkCount(data.bookmarkCount);
      });
  };


  const handleDropdownChange = (event) => {
    setSelectedOption(event.selected);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;

    }
    setSpeedPopupOpen(false);
  };

  const handleBigplayerToggle = () => {
    setIsBigplayer(!isBigplayer);
  };

  const handleVideoChange = (index) => {
    setSelectedOption(index);
    setListPopupOpen(false);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  const getVideoSource = () => {
    switch (selectedOption) {
      case 0:
        return 'https://videos.pond5.com/k-pop-group-itzy-showcases-footage-273775505_main_xxl.mp4';
      case 1:
        return 'https://videos.pond5.com/k-pop-group-itzy-showcases-footage-273775505_main_xxl.mp4';
      case 2:
        return 'https://mediak5jvqbd.fmkorea.com/files/attach/new4/20240531/7093027262_33854530_985f75650efebb641966609a8dd2c280.mp4';
      default:
        return 'https://mediak5jvqbd.fmkorea.com/files/attach/new4/20240531/7093027262_33854530_985f75650efebb641966609a8dd2c280.mp4';
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
	console.log(playbackSpeed);
  }, [playbackSpeed]);

  const videoStyle = isBigplayer
    ? {
      // BIGPLAYER SETTINGS
      height: '100vh',
      transform: 'scale(1)',
      transformOrigin: 'top',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      margin: '-60px',
    }
    : {
      height: '60vh',
      transform: 'scale(1)',
      transformOrigin: 'top',
      width: '60vw',
      display: 'flex',
      justifyContent: 'left',
      margin: screenLeft,
    };

  return (
    <div style={videoStyle}>
      <VideoPlayer
        ref={videoRef}
        autoCloseTimeout={1000}
        backButtonAriaLabel="go to previous"
        feedbackHideDelay={3000}
        initialJumpDelay={400}
        jumpDelay={200}
        loop
        miniFeedbackHideDelay={2000}
        title="Sandstone VideoPlayer Test Video"
        titleHideDelay={4000}
        muted
      >
        <source src={getVideoSource()} type="video/mp4" />
        <infoComponents>
          A video about some things happening to and around some characters.
          Very exciting stuff.
        </infoComponents>
        <MediaControls
          jumpBackwardIcon="jumpbackward"
          jumpForwardIcon="jumpforward"
          pauseIcon="pause"
          playIcon="play"
        >
          <Button icon="list" size="small" onClick={() => setListPopupOpen(true)} />
          <Button icon="playspeed" size="small" onClick={() => setSpeedPopupOpen(true)} />
          <Button icon="miniplayer" size="small" onClick={handleBigplayerToggle} />
          <Button icon="bookmark" size="small" selected={bookmarked} onClick={handleBookmark} />
          <span>{bookmarkCount} Bookmarks</span>
          
        </MediaControls>
      </VideoPlayer>

      <div className={css.commentSection}>
        <h2>Comments</h2>
        <div className={css.commentsContainer}>
          {comments.map((comment, index) => (
            <div key={index} className={css.comment}>
              <p>{comment}</p>
            </div>
          ))}
        </div>

        <div className={css.commentBox}>
          <InputField
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.value)}
            dismissOnEnter
            onKeyUp={(e) => {
              if (e.key === 'Enter') handleAddComment();
            }}
          />
        </div>
        
        <div className={css.addButton}>
          <Button onClick={handleAddComment}>Add Comment</Button>
        </div>
        
      </div>

      <Popup open={isListPopupOpen} onClose={() => setListPopupOpen(false)}>
        {['Option1', 'Option2', 'Option3'].map((option, index) => (
          <RadioItem key={index} selected={selectedOption === index} onClick={() => handleVideoChange(index)}>
            {option}
          </RadioItem>
        ))}
      </Popup>

      <Popup open={isSpeedPopupOpen} onClose={() => setSpeedPopupOpen(false)}>
        {['1.00x', '1.25x', '0.75x'].map((speed, index) => (
          <RadioItem
            key={index}
            selected={playbackSpeed === parseFloat(speed)}
            onClick={() => handleSpeedChange(parseFloat(speed))}
          >
            {speed}
          </RadioItem>
		  
        ))}

      </Popup>
    </div>

    
  );
};

export default Video;