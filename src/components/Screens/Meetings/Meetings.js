import React, { useState, useEffect, useRef } from "react";
import { 
  FaUserTie, FaSearch, FaPlus, FaVideo, FaLink, FaCopy, 
  FaMicrophone, FaMicrophoneSlash, FaVideoSlash, FaHandPaper,
  FaPoll, FaUsers, FaUserFriends, FaImage, FaClosedCaptioning,
  FaRegClock, FaRegThumbsUp, FaRegThumbsDown, FaDownload,
  FaTimes, FaCheck, FaExpand, FaCompress
} from "react-icons/fa";
import { 
  MdClose, MdPeople, MdScreenShare, MdChat, MdMoreVert, 
  MdPresentToAll, MdSettings, MdOutlineBreakfastDining,
  MdOutlineClosedCaption, MdOutlineSecurity, MdOutlineFeedback
} from "react-icons/md";
import { 
  BsThreeDotsVertical, BsRecordCircle, BsEmojiFrown, 
  BsEmojiNeutral, BsEmojiSmile, BsEmojiLaughing
} from "react-icons/bs";
import { IoMdNotifications } from "react-icons/io";
import { RiChatSettingsLine } from "react-icons/ri";
import { GiBreakingChain } from "react-icons/gi";
import { TbGridDots } from "react-icons/tb";
import "./Meetings.css";

const Meetings = () => {
  // State management
  const [showMeetingLinkModal, setShowMeetingLinkModal] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState("");
  const [selectedAudioDevice, setSelectedAudioDevice] = useState("");
  const [availableDevices, setAvailableDevices] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [noiseSuppression, setNoiseSuppression] = useState(true);
  const [echoCancellation, setEchoCancellation] = useState(true);
  const [videoQuality, setVideoQuality] = useState("auto");
  const [bandwidth, setBandwidth] = useState("auto");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [stream, setStream] = useState(null);
  const [mediaError, setMediaError] = useState(null);
  const [virtualBackground, setVirtualBackground] = useState(null);
  const [showBreakoutRooms, setShowBreakoutRooms] = useState(false);
  const [breakoutRooms, setBreakoutRooms] = useState([]);
  const [currentBreakoutRoom, setCurrentBreakoutRoom] = useState(null);
  const [handRaised, setHandRaised] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [activePoll, setActivePoll] = useState(null);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [captions, setCaptions] = useState("");
  const [layout, setLayout] = useState("auto");
  const [showReactions, setShowReactions] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    lobby: true,
    screenShare: "host-only",
    chat: "everyone",
    muteAll: false
  });
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [screenShareMode, setScreenShareMode] = useState("entire-screen"); // "entire-screen", "window", "tab"

  // Refs
  const localVideoRef = useRef(null);
  const screenShareRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const chatContainerRef = useRef(null);
  const captionsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const screenShareContainerRef = useRef(null);

  // Background options
  const backgroundOptions = [
    { id: 'blur', name: 'Blur', image: null },
    { id: 'office', name: 'Office', image: 'office-bg.jpg' },
    { id: 'beach', name: 'Beach', image: 'beach-bg.jpg' },
    { id: 'space', name: 'Space', image: 'space-bg.jpg' },
    { id: 'none', name: 'None', image: null }
  ];

  // Reaction options
  const reactionOptions = [
    { id: 'thumbs-up', icon: <FaRegThumbsUp />, label: 'Thumbs Up' },
    { id: 'thumbs-down', icon: <FaRegThumbsDown />, label: 'Thumbs Down' },
    { id: 'clap', icon: '👏', label: 'Clap' },
    { id: 'laugh', icon: <BsEmojiLaughing />, label: 'Laugh' },
    { id: 'heart', icon: '❤️', label: 'Heart' }
  ];

  // Sample participants data
  const [participants, setParticipants] = useState([
    {
      id: 'local',
      name: localStorage.getItem('username') || "You",
      email: localStorage.getItem('email') || "you@example.com",
      isMuted: false,
      isVideoOff: false,
      isHost: true,
      handRaised: false,
      reaction: null
    },
    {
      id: 'remote-1',
      name: "John Doe",
      email: "john@example.com",
      isMuted: false,
      isVideoOff: false,
      isHost: false,
      handRaised: false,
      reaction: null
    },
    {
      id: 'remote-2',
      name: "Jane Smith",
      email: "jane@example.com",
      isMuted: true,
      isVideoOff: false,
      isHost: false,
      handRaised: true,
      reaction: "thumbs-up"
    }
  ]);

  // Initialize media devices
  useEffect(() => {
    const getMediaDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setAvailableDevices(devices);
        
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        const audioDevices = devices.filter(d => d.kind === 'audioinput');
        
        if (videoDevices.length > 0 && !selectedVideoDevice) {
          setSelectedVideoDevice(videoDevices[0].deviceId);
        }
        
        if (audioDevices.length > 0 && !selectedAudioDevice) {
          setSelectedAudioDevice(audioDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Error enumerating devices:", err);
      }
    };

    getMediaDevices();
    
    navigator.mediaDevices.addEventListener('devicechange', getMediaDevices);
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getMediaDevices);
    };
  }, []);

  // Start/stop recording
  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  // Start local media stream
  const startLocalStream = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        audio: {
          deviceId: selectedAudioDevice ? { exact: selectedAudioDevice } : undefined,
          noiseSuppression: noiseSuppression,
          echoCancellation: echoCancellation
        },
        video: {
          deviceId: selectedVideoDevice ? { exact: selectedVideoDevice } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
      
      setIsMuted(false);
      setIsVideoOff(false);
      setMediaError(null);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setMediaError("Please allow camera and microphone access");
    }
  };

  // Recording functionality
  const startRecording = async () => {
    try {
      recordedChunksRef.current = [];
      setRecordingTime(0);
      
      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Combine camera and screen streams if screen sharing
      let streamToRecord;
      if (isScreenSharing && stream) {
        const combinedStream = new MediaStream([
          ...stream.getTracks(),
          ...screenStream.getTracks()
        ]);
        streamToRecord = combinedStream;
      } else if (isScreenSharing) {
        streamToRecord = screenStream;
      } else if (stream) {
        streamToRecord = stream;
      } else {
        throw new Error("No media streams available to record");
      }

      mediaRecorderRef.current = new MediaRecorder(streamToRecord, {
        mimeType: 'video/webm'
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        setShowRecordingModal(true);
        clearInterval(recordingTimerRef.current);
      };

      mediaRecorderRef.current.start(1000); // Collect data every second
    } catch (error) {
      console.error("Error starting recording:", error);
      setMediaError("Failed to start recording");
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `meeting-recording-${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    }
    setShowRecordingModal(false);
  };

  // Device change handlers
  const handleVideoDeviceChange = async (deviceId) => {
    setSelectedVideoDevice(deviceId);
    try {
      await startLocalStream();
    } catch (error) {
      console.error("Error changing video device:", error);
      setMediaError("Failed to switch camera");
    }
  };

  const handleAudioDeviceChange = async (deviceId) => {
    setSelectedAudioDevice(deviceId);
    try {
      await startLocalStream();
    } catch (error) {
      console.error("Error changing audio device:", error);
      setMediaError("Failed to switch microphone");
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        screenStream.getTracks().forEach(track => track.stop());
        setScreenStream(null);
        setIsScreenSharing(false);
        setIsFullScreen(false);
        return;
      }
      
      const displayMediaOptions = {
        video: {
          displaySurface: screenShareMode === "entire-screen" ? "monitor" : 
                         screenShareMode === "window" ? "window" : "browser",
          frameRate: { ideal: 30 }
        },
        audio: true
      };
      
      const displayStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      
      setScreenStream(displayStream);
      setIsScreenSharing(true);
      
      if (screenShareRef.current) {
        screenShareRef.current.srcObject = displayStream;
      }
      
      displayStream.getVideoTracks()[0].onended = () => {
        setScreenStream(null);
        setIsScreenSharing(false);
        setIsFullScreen(false);
      };
    } catch (err) {
      console.error("Error sharing screen:", err);
      setMediaError('Screen sharing cancelled or failed');
    }
  };

  // Toggle fullscreen for screen share
  const toggleFullScreen = () => {
    if (!isScreenSharing) return;
    
    if (!isFullScreen) {
      if (screenShareContainerRef.current.requestFullscreen) {
        screenShareContainerRef.current.requestFullscreen();
      } else if (screenShareContainerRef.current.webkitRequestFullscreen) {
        screenShareContainerRef.current.webkitRequestFullscreen();
      } else if (screenShareContainerRef.current.msRequestFullscreen) {
        screenShareContainerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    
    setIsFullScreen(!isFullScreen);
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Toggle mute
  const toggleMute = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
        const newMutedState = !audioTracks[0].enabled;
        audioTracks[0].enabled = newMutedState;
        setIsMuted(!newMutedState);
        
        setParticipants(prev => prev.map(p => 
          p.id === 'local' ? {...p, isMuted: !newMutedState} : p
        ));
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length > 0) {
        const newVideoState = !videoTracks[0].enabled;
        videoTracks[0].enabled = newVideoState;
        setIsVideoOff(!newVideoState);
        
        setParticipants(prev => prev.map(p => 
          p.id === 'local' ? {...p, isVideoOff: !newVideoState} : p
        ));
      }
    }
  };

  // Toggle captions
  const toggleCaptions = () => {
    setCaptionsEnabled(!captionsEnabled);
    if (!captionsEnabled) {
      simulateCaptions();
    } else {
      if (captionsRef.current) {
        clearInterval(captionsRef.current);
      }
      setCaptions("");
    }
  };

  // Simulate captions
  const simulateCaptions = () => {
    const phrases = [
      "Hello everyone, thanks for joining",
      "Let's get started with the agenda",
      "First item is the quarterly review",
      "Does anyone have any questions?",
      "We'll circle back to that later",
      "Let me share my screen to show the data"
    ];
    
    captionsRef.current = setInterval(() => {
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setCaptions(randomPhrase);
    }, 5000);
  };

  // Raise hand
  const raiseHand = () => {
    const newHandState = !handRaised;
    setHandRaised(newHandState);
    setParticipants(prev => prev.map(p => 
      p.id === 'local' ? {...p, handRaised: newHandState} : p
    ));
  };

  // Send reaction
  const sendReaction = (reaction) => {
    setParticipants(prev => prev.map(p => 
      p.id === 'local' ? {...p, reaction} : p
    ));
    setShowReactions(false);
    
    // Show reaction for 3 seconds
    setTimeout(() => {
      setParticipants(prev => prev.map(p => 
        p.id === 'local' ? {...p, reaction: null} : p
      ));
    }, 3000);
  };

  // Create breakout rooms
  const createBreakoutRooms = (numRooms) => {
    const newRooms = Array.from({ length: numRooms }, (_, i) => ({
      id: `room-${i+1}`,
      name: `Breakout Room ${i+1}`,
      participants: []
    }));
    
    setBreakoutRooms(newRooms);
    setShowBreakoutRooms(true);
  };

  // Join breakout room
  const joinBreakoutRoom = (roomId) => {
    setCurrentBreakoutRoom(roomId);
    console.log(`Joined breakout room ${roomId}`);
  };

  // Return to main room
  const returnToMainRoom = () => {
    setCurrentBreakoutRoom(null);
  };

  // Create poll
  const createPoll = () => {
    if (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim())) {
      alert("Please enter a question and all options");
      return;
    }
    
    const newPoll = {
      id: Date.now(),
      question: pollQuestion,
      options: pollOptions.map(opt => ({
        text: opt,
        votes: 0
      })),
      voters: []
    };
    
    setActivePoll(newPoll);
    setShowPoll(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
  };

  // Vote in poll
  const voteInPoll = (optionIndex) => {
    if (!activePoll) return;
    
    const updatedPoll = {
      ...activePoll,
      options: activePoll.options.map((opt, i) => 
        i === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
      ),
      voters: [...activePoll.voters, 'local']
    };
    
    setActivePoll(updatedPoll);
  };

  // Close poll
  const closePoll = () => {
    setActivePoll(null);
  };

  // Start timer
  const startTimer = (minutes) => {
    const endTime = Date.now() + minutes * 60000;
    setTimerActive(true);
    
    const timerInterval = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      if (remaining <= 0) {
        clearInterval(timerInterval);
        setTimerActive(false);
        // Play sound
        new Audio('timer-end.mp3').play();
      }
      
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setTimer(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
    }, 1000);
    
    return () => clearInterval(timerInterval);
  };

  // Stop timer
  const stopTimer = () => {
    setTimerActive(false);
    setTimer(null);
  };

  // Submit feedback
  const submitFeedback = () => {
    console.log("Feedback submitted:", feedback);
    setShowFeedback(false);
    setFeedback("");
    alert("Thank you for your feedback!");
  };

  // Generate meeting ID
  const generateMeetingId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  // Generate meeting link
  const generateMeetingLink = (meetingId) => {
    return `${window.location.origin}/meeting/${meetingId}`;
  };

  // Create meeting link
  const handleCreateMeetingLink = () => {
    const meetingId = generateMeetingId();
    const link = generateMeetingLink(meetingId);
    setMeetingLink(link);
    setShowMeetingLinkModal(true);
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingLink);
    alert("Meeting link copied to clipboard!");
  };

  // Start meeting
  const startMeeting = async (meetingId) => {
    try {
      await startLocalStream();
      setActiveMeeting(meetingId);
    } catch (error) {
      console.error("Error starting meeting:", error);
      setMediaError(error.message);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const message = {
      id: Date.now(),
      sender: localStorage.getItem('username') || "You",
      text: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages([...chatMessages, message]);
    setNewMessage("");
    
    // Auto-scroll to the bottom of the chat
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  // Leave meeting
  const leaveMeeting = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      setIsFullScreen(false);
    }
    
    if (captionsRef.current) {
      clearInterval(captionsRef.current);
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    
    setActiveMeeting(null);
    setParticipants([{
      id: 'local',
      name: localStorage.getItem('username') || "You",
      email: localStorage.getItem('email') || "you@example.com",
      isMuted: false,
      isVideoOff: false,
      isHost: true,
      handRaised: false,
      reaction: null
    }]);
    setMediaError(null);
    setCurrentBreakoutRoom(null);
    setActivePoll(null);
    setTimerActive(false);
    setIsRecording(false);
    setRecordingTime(0);
  };

  // Format recording time
  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Initialize stream when meeting starts
  useEffect(() => {
    if (activeMeeting) {
      startLocalStream();
    }
  }, [activeMeeting, selectedAudioDevice, selectedVideoDevice]);

  // Meeting Room UI
  const renderMeetingRoom = () => (
    <div className="video-meeting-room">
      <div className="meeting-header">
        <div className="meeting-title">
          {currentBreakoutRoom ? `Breakout: ${currentBreakoutRoom}` : `Meeting ${activeMeeting}`}
          {isRecording && (
            <span className="recording-indicator">
              <BsRecordCircle /> REC {formatRecordingTime(recordingTime)}
            </span>
          )}
          {timerActive && (
            <span className="timer-indicator">
              <FaRegClock /> {timer}
            </span>
          )}
        </div>
        <div className="meeting-actions">
          <button className="header-btn" onClick={() => setShowParticipants(!showParticipants)}>
            <MdPeople /> <span>People ({participants.length})</span>
          </button>
          <button className="header-btn" onClick={() => setShowChat(!showChat)}>
            <MdChat /> <span>Chat</span>
          </button>
          <button className="header-btn" onClick={() => setShowBreakoutRooms(!showBreakoutRooms)}>
            <GiBreakingChain /> <span>Breakout</span>
          </button>
          <button className="header-btn" onClick={() => setShowSettings(!showSettings)}>
            <MdSettings />
          </button>
          <button className="leave-meeting" onClick={leaveMeeting}>
            Leave
          </button>
        </div>
      </div>
      
      <div className="meeting-content">
        {/* Main video area */}
        <div className={`video-container ${showParticipants || showChat || showBreakoutRooms ? 'with-sidebar' : ''}`}>
          {/* Screen share view */}
          {isScreenSharing && (
            <div className="screen-share-container" ref={screenShareContainerRef}>
              <video 
                ref={screenShareRef}
                autoPlay
                playsInline
                className="screen-share-video"
              />
              <div className="screen-share-controls">
                <button 
                  className="fullscreen-btn"
                  onClick={toggleFullScreen}
                  title={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullScreen ? <FaCompress /> : <FaExpand />}
                </button>
                <div className="screen-share-label">
                  <MdPresentToAll /> You are presenting your screen
                </div>
                <button 
                  className="stop-share-btn"
                  onClick={toggleScreenShare}
                >
                  Stop Sharing
                </button>
              </div>
            </div>
          )}
          
          {/* Captions */}
          {captionsEnabled && captions && (
            <div className="captions-container">
              <div className="captions-text">{captions}</div>
            </div>
          )}
          
          {/* Active poll */}
          {activePoll && (
            <div className="poll-container">
              <div className="poll-header">
                <FaPoll /> Live Poll
                <button className="close-poll" onClick={closePoll}>
                  <MdClose />
                </button>
              </div>
              <div className="poll-question">{activePoll.question}</div>
              <div className="poll-options">
                {activePoll.options.map((option, index) => (
                  <button 
                    key={index}
                    className="poll-option"
                    onClick={() => voteInPoll(index)}
                    disabled={activePoll.voters.includes('local')}
                  >
                    <div className="poll-option-text">{option.text}</div>
                    <div className="poll-option-votes">
                      {option.votes} vote{option.votes !== 1 ? 's' : ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Local video */}
          <div className={`local-video ${isVideoOff ? 'video-off' : ''} ${activeSpeaker === 'local' ? 'active-speaker' : ''}`}>
            {stream && (
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted
                style={{ display: isVideoOff ? 'none' : 'block' }}
              />
            )}
            {isVideoOff && (
              <div className="video-placeholder">
                <div className="user-avatar">
                  {localStorage.getItem('username')?.charAt(0).toUpperCase() || "Y"}
                </div>
              </div>
            )}
            <div className="video-info">
              {localStorage.getItem('username') || "You"} 
              {isMuted && <FaMicrophoneSlash />}
              {handRaised && <FaHandPaper className="hand-raised" />}
              {participants.find(p => p.id === 'local')?.reaction && (
                <div className="reaction-bubble">
                  {reactionOptions.find(r => r.id === participants.find(p => p.id === 'local')?.reaction)?.icon}
                </div>
              )}
            </div>
          </div>
          
          {/* Remote videos */}
          <div className="remote-videos-container">
            {participants
              .filter(p => p.id !== 'local')
              .map(participant => (
                <div 
                  key={participant.id} 
                  className={`remote-video ${participant.isVideoOff ? 'video-off' : ''} ${activeSpeaker === participant.id ? 'active-speaker' : ''}`}
                >
                  <video 
                    ref={el => remoteVideoRefs.current[participant.id] = el}
                    autoPlay 
                    playsInline
                    style={{ display: participant.isVideoOff ? 'none' : 'block' }}
                  />
                  {participant.isVideoOff && (
                    <div className="video-placeholder">
                      <div className="user-avatar">
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  <div className="video-info">
                    {participant.name} 
                    {participant.isMuted && <FaMicrophoneSlash />}
                    {participant.handRaised && <FaHandPaper className="hand-raised" />}
                    {participant.reaction && (
                      <div className="reaction-bubble">
                        {reactionOptions.find(r => r.id === participant.reaction)?.icon}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        {/* Participants sidebar */}
        {showParticipants && (
          <div className="participants-sidebar">
            <div className="sidebar-header">
              <h3><MdPeople /> Participants ({participants.length})</h3>
              <button className="close-sidebar" onClick={() => setShowParticipants(false)}>
                <MdClose />
              </button>
            </div>
            <div className="participants-list">
              {participants.map(participant => (
                <div key={participant.id} className="participant">
                  <div className="participant-avatar">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="participant-info">
                    <div className="participant-name">
                      {participant.name} {participant.isHost && "(Host)"}
                    </div>
                    <div className="participant-status">
                      {participant.isMuted ? (
                        <FaMicrophoneSlash className="mic-icon muted" />
                      ) : (
                        <FaMicrophone className="mic-icon" />
                      )}
                      {participant.isVideoOff ? (
                        <FaVideoSlash className="video-icon" />
                      ) : (
                        <FaVideo className="video-icon" />
                      )}
                      {participant.handRaised && (
                        <FaHandPaper className="hand-icon" />
                      )}
                    </div>
                  </div>
                  {participant.isHost && (
                    <div className="participant-actions">
                      <button className="mute-btn">Mute</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="invite-section">
              <button className="invite-btn" onClick={handleCreateMeetingLink}>
                <FaLink /> Invite others
              </button>
            </div>
          </div>
        )}
        
        {/* Chat sidebar */}
        {showChat && (
          <div className="chat-sidebar">
            <div className="sidebar-header">
              <h3><MdChat /> Chat</h3>
              <button className="close-sidebar" onClick={() => setShowChat(false)}>
                <MdClose />
              </button>
            </div>
            <div className="chat-messages" ref={chatContainerRef}>
              {chatMessages.map(message => (
                <div key={message.id} className="chat-message">
                  <div className="message-sender">{message.sender}</div>
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
        
        {/* Breakout rooms sidebar */}
        {showBreakoutRooms && (
          <div className="breakout-sidebar">
            <div className="sidebar-header">
              <h3><FaUserFriends /> Breakout Rooms</h3>
              <button className="close-sidebar" onClick={() => setShowBreakoutRooms(false)}>
                <MdClose />
              </button>
            </div>
            <div className="breakout-actions">
              <button 
                className="create-breakout-btn"
                onClick={() => createBreakoutRooms(3)}
              >
                Create 3 Breakout Rooms
              </button>
            </div>
            <div className="breakout-rooms-list">
              {breakoutRooms.map(room => (
                <div key={room.id} className="breakout-room">
                  <div className="room-header">
                    <h4>{room.name}</h4>
                    <span>{room.participants.length} participant{room.participants.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="room-actions">
                    {currentBreakoutRoom === room.id ? (
                      <button 
                        className="return-btn"
                        onClick={returnToMainRoom}
                      >
                        Return to Main
                      </button>
                    ) : (
                      <button 
                        className="join-btn"
                        onClick={() => joinBreakoutRoom(room.id)}
                      >
                        Join Room
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Settings sidebar */}
        {showSettings && (
          <div className="settings-sidebar">
            <div className="sidebar-header">
              <h3><MdSettings /> Settings</h3>
              <button className="close-sidebar" onClick={() => setShowSettings(false)}>
                <MdClose />
              </button>
            </div>
            <div className="settings-tabs">
              <div className="tab active">Audio & Video</div>
              <div className="tab">Security</div>
              <div className="tab">Feedback</div>
            </div>
            <div className="settings-content">
              <div className="settings-section">
                <h4>Video Settings</h4>
                <div className="setting-option">
                  <label>Camera</label>
                  <select 
                    value={selectedVideoDevice}
                    onChange={(e) => handleVideoDeviceChange(e.target.value)}
                  >
                    {availableDevices
                      .filter(d => d.kind === 'videoinput')
                      .map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="setting-option">
                  <label>Virtual Background</label>
                  <div className="background-options">
                    {backgroundOptions.map(bg => (
                      <div 
                        key={bg.id}
                        className={`background-option ${virtualBackground?.id === bg.id ? 'active' : ''}`}
                        onClick={() => setVirtualBackground(bg)}
                      >
                        {bg.image ? (
                          <img src={`/backgrounds/${bg.image}`} alt={bg.name} />
                        ) : (
                          <div className="bg-name">{bg.name}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="setting-option">
                  <label>Video Quality</label>
                  <select 
                    value={videoQuality}
                    onChange={(e) => setVideoQuality(e.target.value)}
                  >
                    <option value="auto">Auto</option>
                    <option value="low">Low (360p)</option>
                    <option value="medium">Medium (720p)</option>
                    <option value="high">High (1080p)</option>
                  </select>
                </div>
              </div>
              <div className="settings-section">
                <h4>Audio Settings</h4>
                <div className="setting-option">
                  <label>Microphone</label>
                  <select 
                    value={selectedAudioDevice}
                    onChange={(e) => handleAudioDeviceChange(e.target.value)}
                  >
                    {availableDevices
                      .filter(d => d.kind === 'audioinput')
                      .map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="setting-option">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={noiseSuppression}
                      onChange={() => setNoiseSuppression(!noiseSuppression)}
                    />
                    Noise Suppression
                  </label>
                </div>
                <div className="setting-option">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={echoCancellation}
                      onChange={() => setEchoCancellation(!echoCancellation)}
                    />
                    Echo Cancellation
                  </label>
                </div>
              </div>
              <div className="settings-section">
                <h4>Screen Sharing</h4>
                <div className="setting-option">
                  <label>Screen Share Mode</label>
                  <select
                    value={screenShareMode}
                    onChange={(e) => setScreenShareMode(e.target.value)}
                  >
                    <option value="entire-screen">Entire Screen</option>
                    <option value="window">Application Window</option>
                    <option value="tab">Browser Tab</option>
                  </select>
                </div>
              </div>
              <div className="settings-section">
                <h4>Accessibility</h4>
                <div className="setting-option">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={captionsEnabled}
                      onChange={toggleCaptions}
                    />
                    Enable Live Captions
                  </label>
                </div>
              </div>
              <div className="settings-section">
                <h4>Timer</h4>
                <div className="timer-options">
                  <button onClick={() => startTimer(5)}>5 min</button>
                  <button onClick={() => startTimer(10)}>10 min</button>
                  <button onClick={() => startTimer(15)}>15 min</button>
                  {timerActive && (
                    <button onClick={stopTimer}>Stop Timer</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="meeting-controls">
        <div className="controls-left">
          <button className={`control-btn mic-btn ${isMuted ? 'muted' : ''}`} onClick={toggleMute}>
            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            <span>{isMuted ? "Unmute" : "Mute"}</span>
          </button>
          <button className={`control-btn video-btn ${isVideoOff ? 'video-off' : ''}`} onClick={toggleVideo}>
            {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
            <span>{isVideoOff ? "Start Video" : "Stop Video"}</span>
          </button>
          <button className={`control-btn captions-btn ${captionsEnabled ? 'active' : ''}`} onClick={toggleCaptions}>
            <FaClosedCaptioning />
            <span>Captions</span>
          </button>
        </div>
        
        <div className="controls-center">
          <button className={`control-btn share-btn ${isScreenSharing ? 'active' : ''}`} onClick={toggleScreenShare}>
            <MdScreenShare />
            <span>{isScreenSharing ? "Stop Sharing" : "Share Screen"}</span>
          </button>
          <button className={`control-btn record-btn ${isRecording ? 'active' : ''}`} onClick={() => setIsRecording(!isRecording)}>
            <BsRecordCircle />
            <span>{isRecording ? "Stop Recording" : "Record"}</span>
          </button>
          <button className="control-btn poll-btn" onClick={() => setShowPoll(true)}>
            <FaPoll />
            <span>Poll</span>
          </button>
          <div className={`reactions-container ${showReactions ? 'visible' : ''}`}>
            <button className="reaction-btn" onClick={() => sendReaction('thumbs-up')}>
              <FaRegThumbsUp />
            </button>
            <button className="reaction-btn" onClick={() => sendReaction('thumbs-down')}>
              <FaRegThumbsDown />
            </button>
            <button className="reaction-btn" onClick={() => sendReaction('clap')}>
              👏
            </button>
            <button className="reaction-btn" onClick={() => sendReaction('laugh')}>
              <BsEmojiLaughing />
            </button>
            <button className="reaction-btn" onClick={() => sendReaction('heart')}>
              ❤️
            </button>
          </div>
          <button 
            className="control-btn reactions-btn" 
            onClick={() => setShowReactions(!showReactions)}
          >
            <BsEmojiSmile />
            <span>Reactions</span>
          </button>
        </div>
        
        <div className="controls-right">
          <button 
            className={`control-btn hand-btn ${handRaised ? 'active' : ''}`} 
            onClick={raiseHand}
          >
            <FaHandPaper />
            <span>{handRaised ? "Lower Hand" : "Raise Hand"}</span>
          </button>
          <button className="control-btn more-btn" onClick={() => setShowSettings(!showSettings)}>
            <MdMoreVert />
            <span>More</span>
          </button>
          <button className="control-btn leave-btn" onClick={leaveMeeting}>
            <MdClose />
            <span>Leave</span>
          </button>
        </div>
      </div>
      
      {/* Poll creation modal */}
      {showPoll && (
        <div className="modal-overlay">
          <div className="poll-modal">
            <button className="close-modal" onClick={() => setShowPoll(false)}>
              <MdClose />
            </button>
            <h3>Create Poll</h3>
            <div className="poll-form">
              <div className="form-group">
                <label>Question</label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="Enter your question"
                />
              </div>
              <div className="form-group">
                <label>Options</label>
                {pollOptions.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...pollOptions];
                      newOptions[index] = e.target.value;
                      setPollOptions(newOptions);
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
                <button 
                  className="add-option"
                  onClick={() => setPollOptions([...pollOptions, ""])}
                >
                  Add Option
                </button>
              </div>
              <button className="create-poll" onClick={createPoll}>
                Create Poll
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Feedback modal */}
      {showFeedback && (
        <div className="modal-overlay">
          <div className="feedback-modal">
            <button className="close-modal" onClick={() => setShowFeedback(false)}>
              <MdClose />
            </button>
            <h3><MdOutlineFeedback /> Meeting Feedback</h3>
            <div className="feedback-form">
              <div className="form-group">
                <label>How was your meeting experience?</label>
                <div className="emoji-ratings">
                  <button><BsEmojiFrown /></button>
                  <button><BsEmojiNeutral /></button>
                  <button><BsEmojiSmile /></button>
                  <button><BsEmojiLaughing /></button>
                </div>
              </div>
              <div className="form-group">
                <label>Additional comments</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your feedback..."
                />
              </div>
              <button className="submit-feedback" onClick={submitFeedback}>
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Recording modal */}
      {showRecordingModal && (
        <div className="modal-overlay">
          <div className="recording-modal">
            <div className="recording-modal-header">
              <h3>Meeting Recording</h3>
              <button className="close-modal" onClick={() => setShowRecordingModal(false)}>
                <MdClose />
              </button>
            </div>
            <div className="recording-modal-content">
              <div className="recording-preview">
                <video 
                  src={recordedBlob ? URL.createObjectURL(recordedBlob) : ''}
                  controls
                  autoPlay
                />
              </div>
              <div className="recording-actions">
                <button className="download-btn" onClick={downloadRecording}>
                  <FaDownload /> Download Recording
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {mediaError && (
        <div className="media-error">
          {mediaError}
          <button onClick={startLocalStream}>Retry</button>
        </div>
      )}
    </div>
  );

  // Meeting Link Modal
  const renderMeetingLinkModal = () => (
    <div className="modal-overlay">
      <div className="meeting-link-modal">
        <button className="close-modal" onClick={() => setShowMeetingLinkModal(false)}>
          <MdClose />
        </button>
        <h3>Your Meeting Link</h3>
        <div className="meeting-link-container">
          <FaLink className="link-icon" />
          <input 
            type="text" 
            value={meetingLink} 
            readOnly 
            className="meeting-link-input"
          />
          <button className="copy-link" onClick={copyToClipboard}>
            <FaCopy />
          </button>
        </div>
        <div className="security-settings">
          <h4><MdOutlineSecurity /> Security Settings</h4>
          <div className="security-option">
            <label>
              <input 
                type="checkbox" 
                checked={securitySettings.lobby}
                onChange={() => setSecuritySettings({...securitySettings, lobby: !securitySettings.lobby})}
              />
              Enable waiting room
            </label>
          </div>
          <div className="security-option">
            <label>Screen sharing:</label>
            <select
              value={securitySettings.screenShare}
              onChange={(e) => setSecuritySettings({...securitySettings, screenShare: e.target.value})}
            >
              <option value="host-only">Host only</option>
              <option value="all">All participants</option>
            </select>
          </div>
        </div>
        <div className="meeting-link-actions">
          <button 
            className="start-meeting-btn"
            onClick={() => {
              const meetingId = meetingLink.split('/').pop();
              startMeeting(meetingId);
              setShowMeetingLinkModal(false);
            }}
          >
            Start Meeting
          </button>
          <button 
            className="close-btn"
            onClick={() => setShowMeetingLinkModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="meetings-hybrid-container">
      {/* Header */}
      <div className="meetings-header">
        <div className="header-left">
          <div className="logo">
            <FaVideo className="logo-icon" />
            <span className="logo-text">MeetClone</span>
          </div>
        </div>
        <div className="header-center">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search meetings..." />
          </div>
        </div>
        <div className="header-right">
          <button className="header-btn" onClick={() => setShowFeedback(true)}>
            <MdOutlineFeedback /> Feedback
          </button>
          <button className="header-btn primary" onClick={handleCreateMeetingLink}>
            <FaVideo /> New Meeting
          </button>
          <div className="user-avatar">
            {localStorage.getItem('username')?.charAt(0).toUpperCase() || "Y"}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="meetings-content">
        {!activeMeeting ? (
          <div className="meeting-start-view">
            <div className="welcome-card">
              <h2>Welcome to MeetClone</h2>
              <p>Premium video meetings for your team</p>
              <div className="action-buttons">
                <button className="primary-btn" onClick={handleCreateMeetingLink}>
                  <FaVideo /> New Meeting
                </button>
                <div className="join-meeting">
                  <input type="text" placeholder="Enter meeting code" />
                  <button className="secondary-btn">Join</button>
                </div>
              </div>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <MdScreenShare />
                </div>
                <h3>Screen Sharing</h3>
                <p>Present your screen to the entire meeting</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <BsRecordCircle />
                </div>
                <h3>Recording</h3>
                <p>Record and save your meetings</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <GiBreakingChain />
                </div>
                <h3>Breakout Rooms</h3>
                <p>Split into smaller discussion groups</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaClosedCaptioning />
                </div>
                <h3>Live Captions</h3>
                <p>Automatic real-time captions</p>
              </div>
            </div>
          </div>
        ) : (
          renderMeetingRoom()
        )}
      </div>

      {/* Modals */}
      {showMeetingLinkModal && renderMeetingLinkModal()}
    </div>
  );
};

export default Meetings;