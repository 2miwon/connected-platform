// This is bundle of states of Main.js
import css from './Main.module.less';


import {useCallback, useState, useRef, useEffect} from 'react';
import * as services from '../libs/services';

export const usePopup = () => {
	const [isPopupOpen, openPopup] = useState(false);

	const handlePopupOpen = useCallback(() => {
		openPopup(true);
	}, []);

	const handlePopupClose = useCallback(() => {
		services.launch({id:'com.webos.app.self-diagnosis'})
		openPopup(false);
	}, []);

	return {isPopupOpen, handlePopupOpen, handlePopupClose};
};


export const useVideoTime = (src) => {
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);

  const handleTimeUpdate = useCallback(() => {
    setCurrentTime(videoRef.current.currentTime);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    videoElement.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [handleTimeUpdate]);

  return { currentTime, videoRef };
};

/*
export const useMediaOverlayWithDetails = (videoSrc) => {
	const [videoTime, setVideoTime] = useState('00:00');
	const [randomTitle, setRandomTitle] = useState('Random Title');
	const videoRef = useRef(null);

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds/ 60);
		const secs = Math.floor(seconds %60);
		return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	useEffect(() => {
		const videoElement = videoRef.current;
		const updateVideoTime = () => {
			setVideoTime(formatTime(videoElement.currentTime));

		};

		if(videoElement) {
			videoElement.addEventListener('timeupdate', updateVideoTime);
		}

		return () => {
			if (videoElement) {
				videoElement.removeEventListener('timeupdate', updateVideoTime);

			}

		};

	}, []);

	const MediaOverlayWithDetails = () => (
		<div style={{
			display: 'flex',
			flexwrap: 'wrap', //Allows wrapping to the next line if necessary
			justifycontent: 'space-between', // Distributes space between items
			padding: '10px'
		}}
		>

			  <MediaOverlay 
			  text="Video 1"
			  loop
			  >
			  <source src={videoSrc} />
			  </MediaOverlay>
			  <div style={{
				  marginTop: '10px',
				  textAlgin: 'center'
			  }}
			  >
			  <div> Time: {videoTime}</div>
			  <div>{randomTitle}</div>
			  
			  </div>
		</div>
	);




	return {MediaOverlayWithDetails};
};

*/