import { useState, useRef } from "react";

function useScreenRecorder() {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "hidden", // 마우스 커서 숨기기
        },
      });

      const mediaRecorder = new MediaRecorder(mediaStream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const recordedChunks = mediaStreamRef.current.recordedChunks || [];
          recordedChunks.push(event.data);
          mediaStreamRef.current.recordedChunks = recordedChunks;
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(mediaStreamRef.current.recordedChunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(recordedBlob);
        setVideoUrl(videoUrl);
        localStorage.setItem("recordedVideo", videoUrl);
      };

      mediaStreamRef.current = {
        stream: mediaStream,
        recordedChunks: [],
      };

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaStreamRef.current.stream.getTracks().forEach((track) => track.stop());
      setRecording(false);
    }
  };

  const downloadVideo = () => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = videoUrl;
    a.download = "recorded-video.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return { startRecording, stopRecording, downloadVideo, recording, videoUrl };
}

export default useScreenRecorder;
