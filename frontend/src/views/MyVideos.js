/* eslint-disable */

import Alert from '@enact/sandstone/Alert';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import css from './Main.module.less';
import $L from '@enact/i18n/$L';
import { useConfigs } from '../hooks/configs';
import { usePopup } from './HomeState';
import { InputField } from '@enact/sandstone/Input';

import React, { useState, useEffect } from 'react';

import Region from '@enact/sandstone/Region';
import RadioItem from '@enact/sandstone/RadioItem';
import MediaOverlay from '@enact/sandstone/MediaOverlay';
import VideoPlayer from '@enact/sandstone/VideoPlayer';
import { MediaControls } from '@enact/sandstone/MediaPlayer';

const MyVideos = () => {
  const data = useConfigs();
  const { isPopupOpen, handlePopupOpen, handlePopupClose } = usePopup();
  const { isPopupOpen: isDeleteEditPopupOpen, handlePopupOpen: handleDeleteEditPopupOpen, handlePopupClose: handleDeleteEditPopupClose } = usePopup();

  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoSrc, setNewVideoSrc] = useState('');
  const [newVideoContent, setNewVideoContent] = useState(''); // New state for content
  const [newVideoThumbnail, setNewVideoThumbnail] = useState(''); // New state for thumbnail
  const [editVideoTitle, setEditVideoTitle] = useState('');
  const [editVideoSrc, setEditVideoSrc] = useState('');
  const [editVideoContent, setEditVideoContent] = useState(''); // New state for content
  const [editVideoThumbnail, setEditVideoThumbnail] = useState(''); // New state for thumbnail
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [videos, setVideos] = useState([
    { text: 'Biotech', src: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_3840_2160_25fps.mp4', content: 'Biotech content', thumbnail: 'https://example.com/thumbnail.jpg' },
    { text: 'VR Headset', src: 'https://videos.pexels.com/video-files/3209828/3209828-uhd_3840_2160_25fps.mp4', content: 'VR Headset content', thumbnail: 'https://example.com/thumbnail.jpg' },
    { text: 'Blood Sample', src: 'https://videos.pexels.com/video-files/4074364/4074364-hd_1280_720_25fps.mp4', content: 'Blood Sample content', thumbnail: 'https://example.com/thumbnail.jpg' },
    { text: 'Tattoo', src: 'https://videos.pexels.com/video-files/4124030/4124030-uhd_4096_2160_25fps.mp4', content: 'Tattoo content', thumbnail: 'https://example.com/thumbnail.jpg' },
    { text: 'Clinic', src: 'https://videos.pexels.com/video-files/4488804/4488804-uhd_3840_2160_25fps.mp4', content: 'Clinic content', thumbnail: 'https://example.com/thumbnail.jpg' }
  ]);

  const [playingVideo, setPlayingVideo] = useState(null); // State to track the playing video

  const handleAddVideo = async () => {
    const newVideo = {
      title: newVideoTitle,
      content: newVideoContent,
      url: newVideoSrc,
      author_id: 'AuthorID', // Replace with actual author ID if available
      thumbnail_url: newVideoThumbnail
    };

    try {
      const response = await fetch('http://3.36.212.250:3000/video/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVideo)
      });

      if (response.ok) {
        const responseData = await response.json();
        setVideos([...videos, { text: newVideoTitle, src: newVideoSrc, content: newVideoContent, thumbnail: newVideoThumbnail }]);
        setNewVideoTitle('');
        setNewVideoSrc('');
        setNewVideoContent('');
        setNewVideoThumbnail('');
        handlePopupClose();
      } else {
        console.error('Error adding video:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding video:', error);
    }
  };

  const handleDeleteVideo = () => {
    if (selectedVideo !== null) {
      setVideos(videos.filter((_, index) => index !== selectedVideo));
      setSelectedVideo(null);
      handleDeleteEditPopupClose();
    }
  };

  const handleEditVideo = () => {
    if (selectedVideo !== null) {
      const updatedVideos = videos.map((video, index) =>
        index === selectedVideo ? { text: editVideoTitle, src: editVideoSrc, content: editVideoContent, thumbnail: editVideoThumbnail } : video
      );
      setVideos(updatedVideos);
      setSelectedVideo(null);
      setEditVideoTitle('');
      setEditVideoSrc('');
      setEditVideoContent('');
      setEditVideoThumbnail('');
      setIsEditing(false);
      handleDeleteEditPopupClose();
    }
  };

  const openEditMode = () => {
    if (selectedVideo !== null) {
      const video = videos[selectedVideo];
      setEditVideoTitle(video.text);
      setEditVideoSrc(video.src);
      setEditVideoContent(video.content);
      setEditVideoThumbnail(video.thumbnail);
      setIsEditing(true);
    }
  };

  const handlePlayVideo = (video) => {
    setPlayingVideo(video);
  };

  const handleStopVideo = () => {
    setPlayingVideo(null);
  };

  return (
    <>
      <div className={css.searchBar}>
        <Region title="My Videos" />
        <div>
          <Button onClick={handlePopupOpen} size="small" className={css.smallerbuttonCell}>
            {$L('Add Video')}
          </Button>

          <Button onClick={handleDeleteEditPopupOpen} size="small" className={css.smallerbuttonCell}>
            {$L('Delete/Edit Video')}
          </Button>

          <Alert type="overlay" open={isPopupOpen} onClose={handlePopupClose}>
            <span>{$L('Enter name, link, content, and thumbnail URL.')}</span>
            <div>
              <InputField
                placeholder={$L('Video Title')}
                value={newVideoTitle}
                onChange={({ value }) => setNewVideoTitle(value)}
              />
              <InputField
                placeholder={$L('Video Link')}
                value={newVideoSrc}
                onChange={({ value }) => setNewVideoSrc(value)}
              />
              <InputField
                placeholder={$L('Video Content')}
                value={newVideoContent}
                onChange={({ value }) => setNewVideoContent(value)}
              />
              <InputField
                placeholder={$L('Thumbnail URL')}
                value={newVideoThumbnail}
                onChange={({ value }) => setNewVideoThumbnail(value)}
              />
            </div>
            <div>
              <Button size="small" className={css.buttonCell} onClick={handleAddVideo}>
                {$L('Add Video')}
              </Button>
              <Button size="small" className={css.buttonCell} onClick={handlePopupClose}>
                {$L('Cancel')}
              </Button>
            </div>
          </Alert>

          <Alert type="overlay" open={isDeleteEditPopupOpen} onClose={handleDeleteEditPopupClose}>
            {!isEditing ? (
              <>
                <span>{$L('Select a video to delete or edit.')}</span>
                <div>
                  {videos.map((video, index) => (
                    <RadioItem
                      key={index}
                      selected={selectedVideo === index}
                      onClick={() => setSelectedVideo(index)}
                    >
                      {video.text}
                    </RadioItem>
                  ))}
                </div>
                <div>
                  <Button size="small" className={css.buttonCell} onClick={handleDeleteVideo}>
                    {$L('Delete')}
                  </Button>
                  <Button size="small" className={css.buttonCell} onClick={openEditMode}>
                    {$L('Edit')}
                  </Button>
                  <Button size="small" className={css.buttonCell} onClick={handleDeleteEditPopupClose}>
                    {$L('Cancel')}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <span>{$L('Edit name, link, content, and thumbnail URL.')}</span>
                <div>
                  <InputField
                    placeholder={$L('Video Title')}
                    value={editVideoTitle}
                    onChange={({ value }) => setEditVideoTitle(value)}
                  />
                  <InputField
                    placeholder={$L('Video Link')}
                    value={editVideoSrc}
                    onChange={({ value }) => setEditVideoSrc(value)}
                  />
                  <InputField
                    placeholder={$L('Video Content')}
                    value={editVideoContent}
                    onChange={({ value }) => setEditVideoContent(value)}
                  />
                  <InputField
                    placeholder={$L('Thumbnail URL')}
                    value={editVideoThumbnail}
                    onChange={({ value }) => setEditVideoThumbnail(value)}
                  />
                </div>
                <div>
                  <Button size="small" className={css.buttonCell} onClick={handleEditVideo}>
                    {$L('Save')}
                  </Button>
                  <Button size="small" className={css.buttonCell} onClick={() => setIsEditing(false)}>
                    {$L('Cancel')}
                  </Button>
                </div>
              </>
            )}
          </Alert>
        </div>
      </div>

      <div className={css.mediaContainer}>
        {videos.map((video, index) => (
          <div key={index} onClick={() => handlePlayVideo(video)}>
            <MediaOverlay title={video.text} source={video.src}>
              <video id={`video-${index}`} src={video.src} width="100%" height="auto" />
            </MediaOverlay>
          </div>
        ))}
      </div>

      {playingVideo && (
        <div className={css.fullscreenVideo}>
          <VideoPlayer
            autoCloseTimeout={1000}
            backButtonAriaLabel="go to previous"
            feedbackHideDelay={3000}
            initialJumpDelay={400}
            jumpDelay={200}
            loop
            miniFeedbackHideDelay={2000}
            title={playingVideo.text}
            titleHideDelay={4000}
            muted
            onBack={handleStopVideo} // Add this line to handle the back button press
          >
            <source src={playingVideo.src} type="video/mp4" />
            <infoComponents>
              {playingVideo.content}
            </infoComponents>
            <MediaControls
              jumpBackwardIcon="jumpbackward"
              jumpForwardIcon="jumpforward"
              pauseIcon="pause"
              playIcon="play"
            >
            </MediaControls>
          </VideoPlayer>
        </div>
      )}
    </>
  );
};

export default MyVideos;
