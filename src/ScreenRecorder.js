import React, { useState, useRef } from "react";
import useScreenRecorder from "./hooks/useScreenRecorder";

function ScreenRecorder() {
  const { startRecording, stopRecording, recording } = useScreenRecorder();

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        화면녹화시작
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        화면녹화종료
      </button>
    </div>
  );
}

export default ScreenRecorder;
