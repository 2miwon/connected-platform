/* eslint-disable */

import Alert from '@enact/sandstone/Alert';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import css from './Main.module.less';
import $L from '@enact/i18n/$L';
import { useConfigs } from '../hooks/configs';
import { usePopup } from './HomeState';
import { InputField } from '@enact/sandstone/Input';
import { fetchAllVideos } from '../hooks/server';
import React, { useState, useRef, useEffect } from 'react';
import Region from '@enact/sandstone/Region';
import Dropdown from '@enact/sandstone/Dropdown';
import MediaOverlay from '@enact/sandstone/MediaOverlay';
import VideoPlayer from '@enact/sandstone/VideoPlayer';
import { MediaControls } from '@enact/sandstone/MediaPlayer';

const Home = () => {
  const data = useConfigs();
  const { isPopupOpen, handlePopupOpen, handlePopupClose } = usePopup();
  const [videos, setVideos] = useState([]);
  const [playingVideo, setPlayingVideo] = useState(null); // State to track the playing video
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false); // State to manage comments section visibility
  const [comments, setComments] = useState([]); // State for comments
  const [newComment, setNewComment] = useState(''); // State for new comment input

  const [state, setState] = useState({
    name: '',
    filterType: 'Order A~Z'
  });

  const filterOptions = ['Order A~Z', 'Order Z~A', 'Order by Position', 'Reverse Order by Position'];

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const videosData = await fetchAllVideos();
        console.log("Fetched videos: ", videosData); // Log the fetched videos
        setVideos(videosData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const filteredVideos = Array.isArray(videos)
    ? videos
        .filter(video => video.Title.toLowerCase().includes(state.name.toLowerCase()))
        .sort((a, b) => {
          switch (state.filterType) {
            case 'Order A~Z':
              return a.Title.localeCompare(b.Title);
            case 'Order Z~A':
              return b.Title.localeCompare(a.Title);
            case 'Order by Position':
              return videos.indexOf(a) - videos.indexOf(b);
            case 'Reverse Order by Position':
              return videos.indexOf(b) - videos.indexOf(a);
            default:
              return 0;
          }
        })
    : [];

  const handlePlayVideo = (video) => {
    console.log("Playing video: ", video); // Log the video being played
    setPlayingVideo(video);
  };

  const handleStopVideo = () => {
    setPlayingVideo(null);
    setIsCommentsOpen(false); // Close comments when video stops
  };

  const handleBookmark = async () => {
    const newBookmarkedStatus = !bookmarked;
    setBookmarked(newBookmarkedStatus);

    // Update bookmark status on the server
    try {
      const response = await fetch(`http://3.36.212.250:3000/api/videos/${playingVideo.id}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookmarked: newBookmarkedStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarkCount(data.bookmarkCount);
      } else {
        console.error('Error updating bookmark:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  return (
    <>
      <div className={css.mainHome}>
        <Region title="Main Home" />
        <div className={css.searchBar}>
          <InputField
            type="text"
            value={state.name}
            onChange={e => setState(prev => ({ ...prev, name: e.value }))}
            placeholder="Search"
          />
        </div>
        <div className={css.dropDownAlign}>
          <Dropdown
            title="Filter Type"
            selected={filterOptions.indexOf(state.filterType)}
            onSelect={ev => setState(prev => ({ ...prev, filterType: filterOptions[ev.selected] }))}
          >
            {filterOptions}
          </Dropdown>
        </div>
      </div>
      <div className={css.mediaContainer}>
        {filteredVideos.map((video, index) => (
          <div key={index} className={css.mediaItem} onClick={() => handlePlayVideo(video)}>
            <MediaOverlay title={video.Title} muted >
              <video id={`video-${index}`} src={video.URL} width="100%" height="auto" autoPlay loop muted />
			  <source src={video.URL} />
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
            title={playingVideo.Title}
            titleHideDelay={4000}
            onBack={handleStopVideo} // Add this line to handle the back button press
          >
            <source src={playingVideo.URL} type="video/mp4" />
            <infoComponents>
              {playingVideo.Content}
            </infoComponents>
            <MediaControls
              jumpBackwardIcon="jumpbackward"
              jumpForwardIcon="jumpforward"
              pauseIcon="pause"
              playIcon="play"
            >
              <Button icon="bookmark" size="small" selected={bookmarked} onClick={handleBookmark} />
              <Button icon="info" size="small" selected={isCommentsOpen} onClick={() => setIsCommentsOpen(!isCommentsOpen)} />
              <span>{bookmarkCount} Bookmarks</span>
            </MediaControls>
          </VideoPlayer>
          {isCommentsOpen && (
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
          )}
        </div>
      )}
    </>
  );
};

export default Home;