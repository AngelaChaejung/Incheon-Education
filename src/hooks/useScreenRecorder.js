import { useState, useRef } from "react";
import { useRecoilState } from "recoil";
import RecordRTC, { MediaStreamRecorder } from "recordrtc";
import { recordingAtom } from "../recoil/recordingAtom";

function useScreenRecorder() {
  const [recording, setRecording] = useRecoilState(recordingAtom);
  const [videoUrl, setVideoUrl] = useState("");
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  console.log(recording);

  /** mediaStream생성 후 recordRTC라이브러리를 이용해 화면을 blob으로 localStorage에 저장함. */
  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "never", // 마우스 커서 녹화 안 함
        },
        audio: true,
      });
      // 파일 형식 여기서 설정하는데, mp4로 하려했으나 mp4로 하면 파일이 열리지가 않음. 우선 webm형태로.
      const mediaRecorder = RecordRTC(mediaStream, {
        mimeType: "video/webm",
        recorderType: MediaStreamRecorder,
      });
      // 녹화가 시작되면 mediaStreamRef에 데이터 저장
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const recordedChunks = mediaStreamRef.current.recordedChunks || [];
          recordedChunks.push(event.data);
          mediaStreamRef.current.recordedChunks = recordedChunks;
        }
      };
      // 녹화가 중단되면 먼저 Blob형태로 변환,
      mediaRecorder.onstop = () => {
        console.log("중지");

        const recordedBlob = new Blob(mediaStreamRef.current.recordedChunks, {
          type: "video/webm",
        });
        // 변환된 데이터를 local storage에 잠시 보관한다. 그럼 이걸 파일로 만들어 다운받을거임
        const videoUrl = URL.createObjectURL(recordedBlob);
        setVideoUrl(videoUrl);
        localStorage.setItem("recordedVideo", videoUrl);
      };

      mediaStreamRef.current = {
        stream: mediaStream,
        recordedChunks: [],
      };

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.startRecording();

      setRecording("RECORDING");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    console.log("작동.");
    if (mediaRecorderRef.current) {
      console.log("mediaRecorderRef", mediaRecorderRef.current);
      mediaRecorderRef.current.stopRecording(() => {
        const blob = mediaRecorderRef.current.getBlob();
        const videoUrl = URL.createObjectURL(blob);
        setVideoUrl(videoUrl);
        localStorage.setItem("recordedVideo", videoUrl);

        const stream = mediaStreamRef.current.stream;
        stream.getTracks().forEach((track) => track.stop());
        setRecording("AFTER");
      });
    } else {
      console.log(mediaRecorderRef);
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

  return { startRecording, stopRecording, downloadVideo, videoUrl };
}

export default useScreenRecorder;
