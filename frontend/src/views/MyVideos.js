import Alert from '@enact/sandstone/Alert';
import Button from '@enact/sandstone/Button';
import css from './Main.module.less';
import $L from '@enact/i18n/$L';
import { useConfigs } from '../hooks/configs';
import { usePopup } from './HomeState';
import { InputField } from '@enact/sandstone/Input';
import { deleteVideo } from '../hooks/server'; // Import the deleteVideo function
import React, { useState, useEffect } from 'react';
import Region from '@enact/sandstone/Region';
import RadioItem from '@enact/sandstone/RadioItem';
import MediaOverlay from '@enact/sandstone/MediaOverlay';
import VideoPlayer from '@enact/sandstone/VideoPlayer';
import { MediaControls } from '@enact/sandstone/MediaPlayer';
import { fetchMyVideos } from '../hooks/server';
import { useUserStore } from "../zustand"


const API_URL = 'http://3.36.212.250:3000'; // Your API URL 



const MyVideos = () => {
  const data = useConfigs();
  const { isPopupOpen, handlePopupOpen, handlePopupClose } = usePopup();
  const { isPopupOpen: isDeleteEditPopupOpen, handlePopupOpen: handleDeleteEditPopupOpen, handlePopupClose: handleDeleteEditPopupClose } = usePopup();

  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoSrc, setNewVideoSrc] = useState('');
  const [newVideoContent, setNewVideoContent] = useState(''); // New state for content

  const [editVideoTitle, setEditVideoTitle] = useState('');
  const [editVideoSrc, setEditVideoSrc] = useState('');
  const [editVideoContent, setEditVideoContent] = useState(''); // New state for content

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [comments, setComments] = useState([]); // State for comments
  const [newComment, setNewComment] = useState(''); // State for new comment input
  const [isCommentsOpen, setIsCommentsOpen] = useState(false); // State to manage comments section visibility


  const {user, setUser} = useUserStore();

  const [videos, setVideos] = useState(null);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
          const response = await fetchMyVideos(user);
          console.log("res",response)
          setVideos(response);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    fetchVideos();
  }, [user]);

  const [playingVideo, setPlayingVideo] = useState(null); // State to track the playing video

  const handleAddVideo = async () => {
    const newVideo = {
      title: newVideoTitle,
      content: newVideoContent,
      url: newVideoSrc,
      author_id: user._id, // Replace with actual author ID if available
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
        setNewVideoTitle('');
        setNewVideoSrc('');
        setNewVideoContent('');
        handlePopupClose();
      } else {
        console.error('Error adding video:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding video:', error);
    }
  };

  const handleDeleteVideo = async () => {
    if (selectedVideo !== null) {
      try {
        const videoToDelete = videos[selectedVideo];
        await deleteVideo(videoToDelete.id);
        setVideos(videos?.filter((_, index) => index !== selectedVideo));
        setSelectedVideo(null);
        handleDeleteEditPopupClose();
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const handleEditVideo = () => {
    if (selectedVideo !== null) {
      const updatedVideos = videos?.map((video, index) =>
        index === selectedVideo ? { ...video, text: editVideoTitle, src: editVideoSrc, content: editVideoContent } : video
      );
      setVideos(updatedVideos);
      setSelectedVideo(null);
      setEditVideoTitle('');
      setEditVideoSrc('');
      setEditVideoContent('');
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
      setIsEditing(true);
    }
  };

  const handlePlayVideo = (video) => {
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
            <span>{$L('Enter name, link, content')}</span>
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
                  {videos?.map((video, index) => (
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
                <span>{$L('Edit name, link, content')}</span>
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
        {videos?.map((video, index) => (
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
              <Button icon="bookmark" size="small" selected={bookmarked} onClick={handleBookmark} />
              <Button icon="info" size="small" selected={isCommentsOpen} onClick={() => setIsCommentsOpen(!isCommentsOpen)} />
              <span>{bookmarkCount} Bookmarks</span>
            </MediaControls>
          </VideoPlayer>
          {isCommentsOpen && (
            <div className={css.commentSection}>
              <h2>Comments</h2>
              <div className={css.commentsContainer}>
                {comments?.map((comment, index) => (
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

export default MyVideos;