import React, { useEffect, useRef } from "react";
import { styled } from "styled-components";

const VideoProcessor = ({ setTakePlace, keyRgb }) => {
  const videoRef = useRef(null);
  const c1Ref = useRef(null);
  const c2Ref = useRef(null);

  const backgrounds = ["/image/배경.jpg", "/image/bg.png", "/image/space.jpeg", "/image/trees.jpeg"];
  const [selectedBackground, setSelectedBackground] = React.useState(0);
  let recordedMediaUrl = null;

  useEffect(() => {
    // Get user media (webcam stream)
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
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

      const tolerance = 60; // 허용 오차 범위

      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        // 특정 범위 내의 색상(초록색)은 투명하게 처리합니다.
        if (
          Math.abs(red - keyRgb[0]) < tolerance &&
          Math.abs(green - keyRgb[1]) < tolerance &&
          Math.abs(blue - keyRgb[2]) < tolerance
        ) {
          data[i + 3] = 0; // 투명화 처리
        }
      }

      ctx2.putImageData(imageData, 0, 0);

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
        ></video>
        {/* <div>
        <button onClick={() => setSelectedBackground(0)}>분홍색</button>
        <button onClick={() => setSelectedBackground(1)}>바다</button>
        <button onClick={() => setSelectedBackground(2)}>우주</button>
        <button onClick={() => setSelectedBackground(3)}>나무</button>
      </div> */}
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
