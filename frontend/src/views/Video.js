import VideoPlayer from '@enact/sandstone/VideoPlayer';
import {MediaControls} from '@enact/sandstone/MediaPlayer';
import Button from '@enact/sandstone/Button';
import Region from '@enact/sandstone/Region';
import Dropdown from '@enact/sandstone/Dropdown';
import React, { useState } from 'react';

const Video = (prop) => {
	const [selectedOption, setSelectedOption] = useState(0);

	const handleDropdownChange = (event) => {
		setSelectedOption(event.selected);
	};

	const getVideoSource = () => {
		switch(selectedOption) {
			case 0:
				return prop.src
			case 1:
				return 'https://videos.pexels.com/video-files/7565438/7565438-hd_1080_1920_25fps.mp4';
			case 2:
			    return 'https://videos.pexels.com/video-files/3209828/3209828-uhd_3840_2160_25fps.mp4';
		}
	}
	return (
		<div
			style={{
				height: '60vh',
				transform: 'scale(1)',
				transformOrigin: 'top',
				width: '60vw',
				display: 'flex',
				justifyContent: 'left',
				margin: '0 auto'

			}}
		>
			<Region title="Title Region" />
			<Dropdown defaultSelected={0} inline title="Options" onSelect={handleDropdownChange}>
			{['Option1','Option2','Option3']}
			</Dropdown>
			<div> Sample</div>
			<VideoPlayer
				autoCloseTimeout={4000}
				backButtonAriaLabel="go to previous"
				feedbackHideDelay={3000}
				initialJumpDelay={400}
				jumpDelay={200}
				loop
				miniFeedbackHideDelay={2000}
				muted
				title="Sandstone VideoPlayer Test Video"
				titleHideDelay={4000}
			>
				if defaultSelected=0
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
					<Button icon="list" size="small" />
					<Button icon="playspeed" size="small" />
					<Button icon="speakercenter" size="small" />
					<Button icon="miniplayer" size="small" />
					<Button icon="subtitle" size="small" />
				</MediaControls>
			</VideoPlayer>
		</div>
	);
};

export default Video;
