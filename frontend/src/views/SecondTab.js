import Alert from '@enact/sandstone/Alert';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import css from './Main.module.less';
import $L from '@enact/i18n/$L';
import {useConfigs} from '../hooks/configs';
import {usePopup} from './HomeState';
import {InputField} from '@enact/sandstone/Input';



import {useVideoTime} from './HomeState';
// Import react
import React, { useState, useRef, useEffect } from 'react';

// For customization
import Region from '@enact/sandstone/Region';
import Dropdown from '@enact/sandstone/Dropdown';
import RadioItem from '@enact/sandstone/RadioItem';

// For media dispaly
import MediaOverlay from '@enact/sandstone/MediaOverlay';


// For user input
import Input from '@enact/sandstone/Input';



const MyPage = () => {
	const data = useConfigs();
	const {isPopupOpen, handlePopupOpen, handlePopupClose} = usePopup();
  const { isPopupOpen: isDeleteEditPopupOpen, handlePopupOpen: handleDeleteEditPopupOpen, handlePopupClose: handleDeleteEditPopupClose } = usePopup();

    const [newVideoTitle, setNewVideoTitle] = useState('');
    const [newVideoSrc, setNewVideoSrc] = useState('');
    const [editVideoTitle, setEditVideoTitle] = useState('');
    const [editVideoSrc, setEditVideoSrc] = useState('');
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    

	const [videos, setVideos] = useState([
        { text: 'Biotech', src: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_3840_2160_25fps.mp4' },
        { text: 'VR Headset', src: 'https://videos.pexels.com/video-files/3209828/3209828-uhd_3840_2160_25fps.mp4' },
        { text: 'Blood Sample', src: 'https://videos.pexels.com/video-files/4074364/4074364-hd_1280_720_25fps.mp4' },
        { text: 'Tattoo', src: 'https://videos.pexels.com/video-files/4124030/4124030-uhd_4096_2160_25fps.mp4' },
        { text: 'Clinic', src: 'https://videos.pexels.com/video-files/4488804/4488804-uhd_3840_2160_25fps.mp4' }
      ]);


    const handleAddVideo = () => {
        setVideos([...videos, { text: newVideoTitle, src: newVideoSrc }]);
        setNewVideoTitle('');
        setNewVideoSrc('');
        handlePopupClose();
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
          index === selectedVideo ? { text: editVideoTitle, src: editVideoSrc } : video
        );
        setVideos(updatedVideos);
        setSelectedVideo(null);
        setEditVideoTitle('');
        setEditVideoSrc('');
        setIsEditing(false);
        handleDeleteEditPopupClose();
      }
    };
  
    const openEditMode = () => {
      if (selectedVideo !== null) {
        const video = videos[selectedVideo];
        setEditVideoTitle(video.text);
        setEditVideoSrc(video.src);
        setIsEditing(true);
      }
    };

	
  // 내 영상
  // 내 영상 업로드 (link)
  // 내 영상 삭제
  // 내 영상 수정 <- 이건 안 할듯.
	return (
		<>
			
			<div className={css.searchBar}>
			<Region title="My Videos" />
			

			</div>

			<div className={css.videoGridContainer}>
        <div className={css.videoGrid}>

        
            {videos.map((video, index) => (
            <MediaOverlay key={index} title={video.text} loop>
                <source src={video.src} />
            </MediaOverlay>
                //subtitle={video.src}
                
            
            ))}
          </div>
        </div>
			<div>
      <Button onClick={handlePopupOpen} size="small" className={css.buttonCell}>
        {$L('Add Video')}
      </Button>

      <Button onClick={handleDeleteEditPopupOpen} size="small" className={css.buttonCell}>
          {$L('Delete/Edit Video')}
        </Button>
      
      <Alert type="overlay" open={isPopupOpen} onClose={handlePopupClose}>
        <span>{$L('Enter name and link.')}</span>
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
        </div>
        <div>
          <Button
            size="small"
            className={css.buttonCell}
            onClick={handleAddVideo}
          >
            {$L('Add Video')}
          </Button>
          <Button
            size="small"
            className={css.buttonCell}
            onClick={handlePopupClose}
          >
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
              <Button
                size="small"
                className={css.buttonCell}
                onClick={handleDeleteVideo}
              >
                {$L('Delete')}
              </Button>
              <Button
                size="small"
                className={css.buttonCell}
                onClick={openEditMode}
              >
                {$L('Edit')}
              </Button>
              <Button
                size="small"
                className={css.buttonCell}
                onClick={handleDeleteEditPopupClose}
              >
                {$L('Cancel')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <span>{$L('Edit name and link.')}</span>
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
            </div>
            <div>
              <Button
                size="small"
                className={css.buttonCell}
                onClick={handleEditVideo}
              >
                {$L('Save')}
              </Button>
              <Button
                size="small"
                className={css.buttonCell}
                onClick={() => setIsEditing(false)}
              >
                {$L('Cancel')}
              </Button>
            </div>
          </>
        )}
      </Alert>

    </div>

		</>

	);
};


export default MyPage;

//<BodyText>{`TV Info : ${JSON.stringify(data)}`}</BodyText>

/*
	const MediaOverlayWithDetails = () => 
	{
		const [videoTime, setVideoTime] = useState('00:00');
		const [randomTitle,setRandomTitle] = useState('Random Title');
		const videoRef = useRef(null);

		const formatTime = (seconds) => {
			const minutes = Math.floor(seconds / 60);
			const secs = Math.floor(seconds % 60);
			return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		};

		useEffect(() => {
			const videoElement = videoRef.current;
			const updateVideoTime = () => {
				setVideoTime(formatTime(videoElement.currentTime));

			};
			if (videoElement) {
				videoElement.addEventListener('timeupdate',updateVideoTime);
			}

			return () => {
				if (videoElement) {
					videoElement.removeEventListener('timeupdate',updateVideoTime);
				}
			};

		}, []);

*/