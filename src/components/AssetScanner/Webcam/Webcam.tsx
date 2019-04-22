import React, { Component } from 'react';
import styled from 'styled-components';
import { SetVideoRefCallback } from '../../../interfaces';

const StyledVideo = styled.video`
  background: rgba(0, 0, 0, 0.5);
`;

function hasGetUserMedia() {
  return !!(
    navigator.getUserMedia ||
    // @ts-ignore
    navigator.webkitGetUserMedia ||
    // @ts-ignore
    navigator.mozGetUserMedia ||
    // @ts-ignore
    navigator.msGetUserMedia ||
    (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  );
}

interface WebcamProps {
  audio?: boolean;
  setRef: SetVideoRefCallback;
  height?: number | string;
  width?: number | string;
  className?: string;
  audioSource?: string | null;
  videoSource?: string | null;
  isDesktop?: boolean;
}

interface WebcamState {
  hasUserMedia: boolean;
  src: string;
}

export class Webcam extends Component<WebcamProps, WebcamState> {
  static mountedInstances: Webcam[] = [];
  static userMediaRequested = false;
  static defaultProps = {
    audio: true,
    className: '',
    height: 480,
    width: 640,
    audioSource: null,
    videoSource: null,
    isDesktop: true,
  };

  state: WebcamState = {
    hasUserMedia: false,
    src: '',
  };

  video: HTMLVideoElement | null = null;
  stream: MediaStream | null = null;

  componentDidMount() {
    if (!hasGetUserMedia()) {
      return;
    }

    Webcam.mountedInstances.push(this);

    if (!this.state.hasUserMedia && !Webcam.userMediaRequested) {
      this.requestUserMedia();
    }
  }

  componentWillUpdate(nextProps: WebcamProps) {
    if (
      nextProps.videoSource !== this.props.videoSource ||
      nextProps.audioSource !== this.props.audioSource
    ) {
      this.requestUserMedia();
    }
  }

  componentWillUnmount() {
    const index = Webcam.mountedInstances.indexOf(this);
    Webcam.mountedInstances.splice(index, 1);

    if (
      Webcam.mountedInstances.length === 0 &&
      this.state.hasUserMedia &&
      this.stream
    ) {
      if (this.stream.stop) {
        this.stream.stop();
      } else {
        if (this.stream.getVideoTracks) {
          this.stream.getVideoTracks().forEach(track => track.stop());
        }
        if (this.stream.getAudioTracks) {
          this.stream.getAudioTracks().forEach(track => track.stop());
        }
      }
      Webcam.userMediaRequested = false;
      window.URL.revokeObjectURL(this.state.src);
    }
  }

  requestUserMedia() {
    this.setGlobalUserMediaInterface();

    if (this.props.audioSource && this.props.videoSource) {
      this.sourceSelected(this.props.audioSource, this.props.videoSource);
    } else if ('mediaDevices' in navigator) {
      navigator.mediaDevices
        .enumerateDevices()
        .then(devices => {
          let audioSource = '';
          let videoSource = '';
          devices.forEach(device => {
            if (device.kind === 'audioinput') {
              audioSource = device.deviceId;
            } else if (device.kind === 'videoinput') {
              videoSource = device.deviceId;
            }
          });

          if (this.props.audioSource) {
            audioSource = this.props.audioSource;
          }
          if (this.props.videoSource) {
            videoSource = this.props.videoSource;
          }

          this.sourceSelected(audioSource, videoSource);
        })
        .catch(error => {
          // todo: add error handling
          console.error(error);
        });
    }

    Webcam.userMediaRequested = true;
  }

  handleUserMedia(stream: MediaStream | null, error?: MediaStreamError) {
    if (error) {
      this.setState({
        hasUserMedia: false,
      });

      return;
    }
    try {
      this.stream = stream;

      if (this.video) {
        this.video.srcObject = stream;
      }

      this.setState({
        hasUserMedia: true,
      });
    } catch (err) {
      const src = window.URL.createObjectURL(stream);

      this.stream = stream;
      this.setState({
        hasUserMedia: true,
        src,
      });
    }
  }

  render() {
    const { isDesktop, setRef } = this.props;
    const videoStyles = isDesktop ? {} : { objectFit: 'cover' as 'cover' };
    return (
      <StyledVideo
        autoPlay={true}
        width="100%"
        height="100%"
        src={this.state.src}
        muted={this.props.audio}
        className={this.props.className}
        style={{
          ...videoStyles,
        }}
        ref={ref => {
          this.video = ref;
          if (setRef) {
            setRef(ref);
          }
        }}
      />
    );
  }

  private setGlobalUserMediaInterface() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      // @ts-ignore
      navigator.webkitGetUserMedia ||
      // @ts-ignore
      navigator.mozGetUserMedia ||
      // @ts-ignore
      navigator.msGetUserMedia ||
      navigator.mediaDevices.getUserMedia;
  }

  private sourceSelected(audioSource: string, videoSource: string) {
    const constraints: MediaStreamConstraints = {
      video: { facingMode: 'environment' },
    };

    if (videoSource) {
      constraints.video = {
        deviceId: videoSource,
      };
    }

    if (this.props.audio) {
      constraints.audio = {
        deviceId: audioSource,
      };
    }

    navigator.getUserMedia(
      constraints,
      stream => {
        Webcam.mountedInstances.forEach(instance =>
          instance.handleUserMedia(stream)
        );
      },
      e => {
        Webcam.mountedInstances.forEach(instance =>
          instance.handleUserMedia(null, e)
        );
      }
    );
  }
}
