import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, VoiceConnectionState } from '../types';

interface VoiceChannelViewProps {
  connection: VoiceConnectionState;
  userProfile: UserProfile;
  isMuted: boolean;
  isDeafened: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  onDisconnect: () => void;
}

export const VoiceChannelView: React.FC<VoiceChannelViewProps> = ({
  connection,
  userProfile,
  isMuted,
  isDeafened,
  onToggleMute,
  onToggleDeafen,
  onDisconnect,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Setup Microphone Voice Detection
  useEffect(() => {
    let isCancelled = false;

    async function initMic() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (isCancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        micStreamRef.current = stream;

        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkAudio = () => {
          if (isCancelled) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          setIsSpeaking(!isMuted && average > 12);
          animFrameRef.current = requestAnimationFrame(checkAudio);
        };
        checkAudio();
      } catch {
        // Fallback or permission dismissed - simulated voice pulses on click / activity
      }
    }

    initMic();

    return () => {
      isCancelled = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isMuted]);

  // Update screen video element srcObject
  useEffect(() => {
    if (videoRef.current && screenStream) {
      videoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  // Start 4K Screenshare
  const handleStartScreenShare = async () => {
    setStreamError(null);
    try {
      // 4K Screen Share Constraints (3840x2160 @ 60fps)
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 3840, max: 3840 },
          height: { ideal: 2160, max: 2160 },
          frameRate: { ideal: 60, max: 60 },
        },
        audio: true,
      });

      stream.getVideoTracks()[0].onended = () => {
        setScreenStream(null);
      };

      setScreenStream(stream);
    } catch {
      setStreamError('Screenshare cancelled or unsupported in current browser context.');
    }
  };

  const handleStopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
    }
  };

  return (
    <div className="voice-stage-container">
      {/* Top 4K Screen Share View if active */}
      {screenStream ? (
        <div className="screenshare-stage">
          <div className="screenshare-header-bar">
            <div className="screenshare-badge-row">
              <span className="live-badge">LIVE</span>
              <span className="res-badge">4K 60FPS</span>
              <span className="sharer-name">
                {userProfile.displayName || userProfile.username}'s Screen
              </span>
            </div>
            <button
              type="button"
              className="stop-screenshare-btn"
              onClick={handleStopScreenShare}
            >
              Stop Sharing
            </button>
          </div>
          <div className="video-player-wrapper">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="screenshare-video-element"
            />
          </div>
        </div>
      ) : null}

      {/* Voice Participants Grid */}
      <div className="voice-participants-grid">
        <div className={`participant-card ${isSpeaking ? 'speaking' : ''}`}>
          <div className="participant-avatar-wrapper">
            {userProfile.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt="Avatar"
                className="participant-avatar-img"
              />
            ) : (
              <div className="avatar-placeholder-circle-lg" />
            )}
            <div
              className={`participant-speaking-ring ${
                isSpeaking ? 'active' : ''
              }`}
            />
          </div>
          <div className="participant-name-plate">
            <span className="participant-display-name">
              {userProfile.displayName || userProfile.username || 'User'}
            </span>
            {isMuted && (
              <span className="status-mini-icon muted" title="Muted">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l4.07 4.07c-.52.26-1.09.43-1.72.49V21h-2v-2.52c-2.84-.36-5.1-2.53-5.5-5.38L4.27 3z" />
                </svg>
              </span>
            )}
            {isDeafened && (
              <span className="status-mini-icon deafened" title="Deafened">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3a9 9 0 0 0-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1a7 7 0 0 1 14 0v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 0 0-9-9z" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>

      {streamError && <div className="voice-error-text">{streamError}</div>}

      {/* Voice Controls Bar */}
      <footer className="voice-controls-bar">
        <div className="voice-channel-info-pill">
          <span className="voice-speaker-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
          </span>
          <span className="voice-channel-name">{connection.channelName}</span>
        </div>

        <div className="voice-action-buttons">
          {/* Mute */}
          <button
            type="button"
            className={`voice-action-btn ${isMuted ? 'danger' : ''}`}
            onClick={onToggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>

          {/* Deafen */}
          <button
            type="button"
            className={`voice-action-btn ${isDeafened ? 'danger' : ''}`}
            onClick={onToggleDeafen}
            title={isDeafened ? 'Undeafen' : 'Deafen'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3a9 9 0 0 0-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1a7 7 0 0 1 14 0v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 0 0-9-9z" />
            </svg>
          </button>

          {/* 4K Screen Share */}
          {!screenStream ? (
            <button
              type="button"
              className="voice-action-btn"
              onClick={handleStartScreenShare}
              title="Share Screen (4K Supported)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.11-.9-2-2-2H4c-1.11 0-2 .89-2 2v10c0 1.1.89 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              className="voice-action-btn active"
              onClick={handleStopScreenShare}
              title="Stop Screenshare"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          )}

          {/* Disconnect */}
          <button
            type="button"
            className="voice-action-btn disconnect"
            onClick={onDisconnect}
            title="Disconnect"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.996.996 0 0 1 0-1.41C2.96 8.91 7.23 7 12 7c4.77 0 9.04 1.91 11.71 4.67.39.39.39 1.02 0 1.41l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
};
