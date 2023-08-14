import React, { useEffect, useRef } from "react";
import RecordRTC from "recordrtc";
import { styled } from "styled-components";

const VideoProcessor = ({ setTakePlace, keyRgb }) => {
  const videoRef = useRef(null);
  const c1Ref = useRef(null);
  const c2Ref = useRef(null);

  const backgrounds = ["/image/배경.jpg", "/image/bg.png", "/image/space.jpeg", "/image/trees.jpeg"];
  const [selectedBackground, setSelectedBackground] = React.useState(0);
  let recordedMediaUrl = null;
  let mediaRecorder;

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const c1 = c1Ref.current;
    const ctx1 = c1.getContext("2d");
    const c2 = c2Ref.current;
    const ctx2 = c2.getContext("2d");

    const timerCallback = () => {
      ctx1.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, c1.width, c1.height);
      const imageData = ctx1.getImageData(0, 0, c1.width, c1.height);
      const data = imageData.data;

      const tolerance = 60;

      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        if (
          Math.abs(red - keyRgb[0]) < tolerance &&
          Math.abs(green - keyRgb[1]) < tolerance &&
          Math.abs(blue - keyRgb[2]) < tolerance
        ) {
          data[i + 3] = 0;
        }
      }

      ctx2.putImageData(imageData, 0, 0);

      if (mediaRecorder) {
        mediaRecorder.recordCanvas(c2Ref.current);
      }

      setTimeout(timerCallback, 33);
    };

    video.addEventListener("play", () => {
      timerCallback();
    });

    return () => {
      video.removeEventListener("play", () => {
        timerCallback();
      });
    };
  }, []);

  const startRecording = () => {
    const canvasStream = c2Ref.current.captureStream(30);
    mediaRecorder = new RecordRTC(canvasStream, {
      type: "canvas",
      mimeType: "video/webm",
      frameInterval: 33,
    });

    mediaRecorder.startRecording();
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stopRecording(() => {
        const blob = mediaRecorder.getBlob();
        recordedMediaUrl = URL.createObjectURL(blob);
      });
    }
  };

  return (
    <>
      <StBody>
        <video
          width={"400px"}
          id="video"
          ref={videoRef}
          autoPlay
          controls
          crossOrigin="anonymous"
          style={{ display: "none" }}
          muted
        ></video>
        <canvas id="c1" ref={c1Ref} width="400" height="300" style={{ display: "none" }}></canvas>
        <StContainer
          onDoubleClick={() => {
            setTakePlace(true);
          }}
        >
          <StCanvas
            id="c2"
            ref={c2Ref}
            width="400"
            height="300"
            style={{ backgroundImage: `url(${backgrounds[selectedBackground]})` }}
          ></StCanvas>
        </StContainer>

        {recordedMediaUrl && (
          <video controls>
            <source src={recordedMediaUrl} type="video/webm" />
          </video>
        )}
      </StBody>
    </>
  );
};

export default VideoProcessor;

const StBody = styled.div`
  display: flex;
  flex-direction: row;
`;
const StContainer = styled.div`
  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;

const StCanvas = styled.canvas`
  position: absolute;
  z-index: 2;
  width: 50%;
  height: 100vh;
  object-fit: cover;
  background-size: cover;
`;
