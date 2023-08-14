import React, { useState, useRef } from "react";
import useScreenRecorder from "../hooks/useScreenRecorder";
import { StScript } from "./Script";
import { useRecoilState } from "recoil";
import { recordingAtom } from "../recoil/recordingAtom";
import { styled } from "styled-components";

function RecordController() {
  const { startRecording, stopRecording } = useScreenRecorder();
  const [recording, setRecording] = useRecoilState(recordingAtom);
  console.log(recording);
  return (
    <StRecordController.Bg>
      {recording === "BEFORE" && (
        <>
          <StScript.RoundBtn
            style={{ justifyContent: "center", alignItems: "center", margin: "auto" }}
            onClick={startRecording}
            disabled={recording}
          >
            녹화시작
          </StScript.RoundBtn>
          <StRecordController.Instruction>
            녹화시작 버튼 클릭 후<br />
            <strong>'인천 교육청 박람회' 탭</strong>을 선택하고
            <br /> <strong>공유</strong>버튼을 누르면 녹화가 시작됩니다.
          </StRecordController.Instruction>
        </>
      )}
      {recording === "RECORDING" && (
        <>
          <StScript.RoundBtn
            style={{ justifyContent: "center", alignItems: "center", margin: "auto" }}
            onClick={stopRecording}
          >
            종료
          </StScript.RoundBtn>
        </>
      )}
      {recording === "AFTER" && (
        <StRecordController.Instruction>
          <strong>다운로드</strong>버튼을 눌러 <br />
          영상을 저장해주세요.
        </StRecordController.Instruction>
      )}
    </StRecordController.Bg>
  );
}

export default RecordController;

const StRecordController = {
  Bg: styled.div`
    background-color: #fffef2;
    width: 294px;
    height: 250px;
    overflow-x: hidden;
    padding: 22px;
    display: flex;
    flex-direction: column;
  `,

  Instruction: styled.p`
    font: normal normal normal 18px/28px NanumSquareOTF;
    width: fit-content;
    justify-content: center;
    align-items: center;
    margin: auto;
    text-align: center;
  `,
};
