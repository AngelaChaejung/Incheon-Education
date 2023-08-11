import React, { useState, useRef } from "react";
import useScreenRecorder from "../hooks/useScreenRecorder";
import { StScript } from "./Script";
import { useRecoilState } from "recoil";
import { recordingAtom } from "../recoil/recordingAtom";

function ScreenRecorder() {
  const { startRecording, stopRecording } = useScreenRecorder();
  const [recording, setRecording] = useRecoilState(recordingAtom);
  console.log(recording);
  return (
    <div>
      {recording === "BEFORE" && (
        <>
          <StScript.RoundBtn onClick={startRecording} disabled={recording}>
            녹화시작
          </StScript.RoundBtn>
          <span>인천 교육청 박람회를 선택하고 공유버튼을 눌러주세요</span>
        </>
      )}
      {recording === "RECORDING" && (
        <>
          <StScript.RoundBtn onClick={stopRecording}>종료</StScript.RoundBtn> <span>종료 후 영상을 다운받아주세요</span>
        </>
      )}
    </div>
  );
}

export default ScreenRecorder;
