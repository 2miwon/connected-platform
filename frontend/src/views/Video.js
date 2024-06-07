/* eslint-disable */

import VideoPlayer from '@enact/sandstone/VideoPlayer';
import { MediaControls } from '@enact/sandstone/MediaPlayer';
import Button from '@enact/sandstone/Button';

import Popup from '@enact/sandstone/Popup';
import RadioItem from '@enact/sandstone/RadioItem';

import React, { useState, useRef, useEffect } from 'react';

const Video = (prop) => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [isListPopupOpen, setListPopupOpen] = useState(false);
  const [isSpeedPopupOpen, setSpeedPopupOpen] = useState(false);
  const [isBigplayer, setIsBigplayer] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const videoRef = useRef(null);

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

  const getVideoSource = () => {
    switch (selectedOption) {
      case 0:
        return prop.src;
      case 1:
        return 'https://videos.pond5.com/k-pop-group-itzy-showcases-footage-273775505_main_xxl.mp4';
      case 2:
        return 'https://mediak5jvqbd.fmkorea.com/files/attach/new4/20240531/7093027262_33854530_985f75650efebb641966609a8dd2c280.mp4';
      default:
        return prop.src;
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
      margin: '0 auto',
    };

  return (
    <div style={videoStyle}>
      <VideoPlayer
        ref={videoRef}
        autoCloseTimeout={4000}
        backButtonAriaLabel="go to previous"
        feedbackHideDelay={3000}
        initialJumpDelay={400}
        jumpDelay={200}
        loop
        miniFeedbackHideDelay={2000}
        title="Sandstone VideoPlayer Test Video"
        titleHideDelay={4000}
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
        </MediaControls>
      </VideoPlayer>

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