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

// For media dispaly
import MediaOverlay from '@enact/sandstone/MediaOverlay';

// For user input
import Input from '@enact/sandstone/Input';



const Home = () => {
	const data = useConfigs();
	const {isPopupOpen, handlePopupOpen, handlePopupClose} = usePopup();
	const [state, setState] = useState({
		name: '',
		filterType: 'name'
	});
	const formatTime = (time) => 
	{
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
	};

	const videos = [
    { text: 'Biotech', src: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_3840_2160_25fps.mp4' },
    { text: 'VR Headset', src: 'https://videos.pexels.com/video-files/3209828/3209828-uhd_3840_2160_25fps.mp4' },
    { text: 'Blood Sample', src: 'https://videos.pexels.com/video-files/4074364/4074364-hd_1280_720_25fps.mp4' },
    { text: 'Tattoo', src: 'https://videos.pexels.com/video-files/4124030/4124030-uhd_4096_2160_25fps.mp4' },
    { text: 'Clinic', src: 'https://videos.pexels.com/video-files/4488804/4488804-uhd_3840_2160_25fps.mp4' }
  ];


	const filterOptions = ['Filter by Name', 'Filter by Number'];

	const filteredVideos = videos.filter(video => {
    if (state.filterType === 'name') {
      return video.text.toLowerCase().includes(state.name.toLowerCase());
    } else if (state.filterType === 'number') {
      return video.text.toLowerCase().includes(state.name.toLowerCase().replace('video ', ''));
    }
    return true;
  });

	return (
		<>
			
			<div className={css.searchBar}>
			<Region title="Main Home" />
			<InputField
				type="text"
				value={state.name}
				onChange={e => setState(prev => ({...prev, name: e.value}))}
				placeholder="Search"
			/>

			</div>
			<Dropdown
				title="Filter Type"
				selected={state.filterType === 'name' ? 0 : 1}
				onSelect={ev => setState(prev => ({ ...prev, filterType: ev.selected === 0 ? 'name' : 'number' }))}
			>
				{filterOptions}
			</Dropdown>


			<div className={css.mediaContainer}>

			  {filteredVideos.map((video, index) => (
          <MediaOverlay key={index} text={video.text} loop>
            <source src={video.src} />
          </MediaOverlay>
        ))}
			  
			</div>
			
			
			<Button onClick={handlePopupOpen} size="small" className={css.buttonCell}>
				{$L('This is a main page of sample application.')}
			</Button>
			
			
			<Alert type="overlay" open={isPopupOpen} onClose={handlePopupClose}>
				<span>{$L('This is an alert message.')}</span>
				<buttons>
					<Button
						size="small"
						className={css.buttonCell}
						onClick={handlePopupClose}
					>
						{$L('OK')}
					</Button>
				</buttons>
			</Alert>

		</>

	);
};


export default Home;

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