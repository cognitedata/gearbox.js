import React, { Component } from 'react';

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
  setRef: any;
  height?: number | string;
  width?: number | string;
  // screenshotFormat?: 'image/webp' | 'image/png' | 'image/jpeg';
  screenshotFormat?: ['image/webp', 'image/png', 'image/jpeg'];
  className?: string;
  audioSource?: string | null;
  videoSource?: string | null;
  isDesktop?: boolean;
  onUserMedia?: any;
}

interface WebcamState {
  hasUserMedia: boolean;
  src: string;
}

class Webcam extends Component<WebcamProps, WebcamState> {
  static mountedInstances: Webcam[] = [];
  static userMediaRequested = false;
  static defaultProps = {
    audio: true,
    className: '',
    height: 480,
    screenshotFormat: 'image/webp',
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
          this.stream.getVideoTracks().map(track => track.stop());
        }
        if (this.stream.getAudioTracks) {
          this.stream.getAudioTracks().map(track => track.stop());
        }
      }
      Webcam.userMediaRequested = false;
      window.URL.revokeObjectURL(this.state.src);
    }
  }

  requestUserMedia() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      // @ts-ignore
      navigator.webkitGetUserMedia ||
      // @ts-ignore
      navigator.mozGetUserMedia ||
      // @ts-ignore
      navigator.msGetUserMedia ||
      navigator.mediaDevices.getUserMedia;

    const sourceSelected = (audioSource: string, videoSource: string) => {
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
    };

    if (this.props.audioSource && this.props.videoSource) {
      sourceSelected(this.props.audioSource, this.props.videoSource);
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

          sourceSelected(audioSource, videoSource);
        })
        .catch(error => {
          // todo: add error handling
          console.error(error);
        });
    }

    Webcam.userMediaRequested = true;
  }

  handleUserMedia(stream: MediaStream | null, error?: MediaStreamError) {
    const { onUserMedia } = this.props;

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

      if (onUserMedia) {
        onUserMedia();
      }
    } catch (err) {
      const src = window.URL.createObjectURL(stream);

      this.stream = stream;
      this.setState({
        hasUserMedia: true,
        src,
      });

      console.error(err);
    }
  }

  render() {
    const { isDesktop, setRef } = this.props;
    const videoStyles = isDesktop ? {} : { objectFit: 'cover' as 'cover' };
    return (
      <video
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
}

export default Webcam;
