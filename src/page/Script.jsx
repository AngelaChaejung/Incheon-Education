import React, { useState } from "react";
import { styled } from "styled-components";
import useScreenRecorder from "../hooks/useScreenRecorder";
import { useRecoilState } from "recoil";
import { recordingAtom } from "../recoil/recordingAtom";

const Script = () => {
  const mock = {
    speechTitle: "샘플 스피치 주제",
    speechScript: ` Famine Long ago, a poor woodcutter lived by a forest with his new wife and two children. The boy was called
        Hansel and the girl was called Gretel. The family was always poor, but they had enough to eat. One year, a
        famine came to the land. The woodcutter did not have enough food to feed his children. He said to his wife,
        “What is to become of us? How are we to feed our poor children?” “Don’t worry, husband,” answered his wife.
        “Early tomorrow morning we will take Hansel and Gretel deep into the forest. We will light a fire for them. I
        will give each of them one piece of bread, and then we will leave. They will not find their way home again, and
        we shall be rid of them.” She said this because she was not their real mother.`,
  };
  const { downloadVideo, stopRecording } = useScreenRecorder();
  const [recording, setRecording] = useRecoilState(recordingAtom);
  const audioUrl = "/sound/sample.mp3";
  const [audio] = useState(new Audio(audioUrl));
  const [isPlaying, setIsPlaying] = useState(false);

  const openPopup = () => {
    const popupWidth = 340;
    const popupHeight = 300;
    // 화면 중앙에 위치하도록 계산
    const left = window.screenX + (window.outerWidth - popupWidth) / 2;
    const top = window.screenY + (window.outerHeight - popupHeight) / 2;
    const options = `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`;
    window.open("/record", "record pop-up", options);
  };
  /** 스크립트 클릭시 음원이 재생되게하는 함수 */
  const handleTogglePlayback = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  /** 사운드가 재생되고 있을 때 다시 클릭하면 사운드가 중지됨 */
  const handleStop = () => {
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  /** 일시적으로 localStorage에 저장해둔 녹화영상을 파일로 만들어 저장하는 함수 */
  const download = () => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = localStorage.getItem("recordedVideo");
    a.download = "recorded-video.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    localStorage.removeItem("recordedVideo");
    setRecording("BEFORE");
  };

  React.useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "recordedVideo") {
        if (event.newValue) {
          setRecording("AFTER");
        } else {
          setRecording("BEFORE");
        }
      }
    };
    // localStorage 변경을 감시하는 이벤트 리스너 추가
    window.addEventListener("storage", handleStorageChange);
    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <StScript.Bg>
      <StScript.Header>
        <StScript.HeaderText>{mock.speechTitle}</StScript.HeaderText>
      </StScript.Header>
      <StScript.ContentPlace onClick={isPlaying ? handleStop : handleTogglePlayback}>
        {mock.speechScript}
      </StScript.ContentPlace>
      <StScript.BtnBlock>
        {recording === "BEFORE" && <StScript.RoundBtn onClick={openPopup}>시작</StScript.RoundBtn>}
        {recording === "RECORDING" && <StScript.RoundBtn onClick={stopRecording}>완료</StScript.RoundBtn>}
        {recording === "AFTER" && <StScript.RoundBtn onClick={download}>다운로드</StScript.RoundBtn>}
      </StScript.BtnBlock>
      {/* script 내용이 얼마나 길어질지 알아야함. 학생이 서있는 곳과 스크린의 거리에 맞는 글씨 크기를 이용해야함.
          필요한 내용 1. 스크립트 길이
          2. 학생이 서있는 단상과 스크린의 거리 */}
    </StScript.Bg>
  );
};

export default Script;

export const StScript = {
  Bg: styled.div`
    background-color: #fffef2;
    width: 50%;
    height: 100vh;
    z-index: 3;
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: column;
  `,
  Header: styled.div`
    height: 57px;
    background: #24a19c 0% 0%;
    display: flex;
    padding: 12px 0;
  `,
  HeaderText: styled.div`
    font-family: "NanumSquareNeo-Variable";
    letter-spacing: -0.52px;
    color: #ffffff;
    font-size: 26px;
    font-weight: 800;
    text-align: left;
    display: flex;
    align-items: center;
    padding-left: 60px;
  `,
  ContentPlace: styled.div`
    cursor: pointer;
    padding: 40px;
    height: fit-content;
    width: auto;
    background: #ffffff 0% 0%;
    box-shadow: 0px 0px 30px #26c4b121;
    border-radius: 20px;
    z-index: 4;
    justify-content: center;
    margin: 29px 40px 21px 40px;
    align-items: center;
    font: normal normal normal 30px/53px NanumSquareOTF;
    color: #222222;
  `,
  RoundBtn: styled.div`
    background-color: #26c4b1;
    width: 60px;
    height: 60px;
    border-radius: 999px;
    color: #fff;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    display: flex;
    font-weight: 800;
  `,
  BtnBlock: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
  `,
};
