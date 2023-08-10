import React from "react";
import { styled } from "styled-components";

const Script = () => {
  const openPopup = () => {
    const popupWidth = 300;
    const popupHeight = 200;
    const left = window.innerWidth - popupWidth;
    const top = window.innerHeight - popupHeight;

    const options = `width=${popupWidth},height=${popupHeight},left=${left},top=${top},`;

    window.open("/record", "popup", options);
  };
  const download = () => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = localStorage.getItem("recordedVideo");
    a.download = "recorded-video.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <StScript.Bg>
      <StScript.Header>
        <StScript.HeaderText>스피치 주제</StScript.HeaderText>
      </StScript.Header>
      <StScript.ContentPlace>
        Chapter 1 Famine Long ago, a poor woodcutter lived by a forest with his new wife and two children. The boy was
        called Hansel and the girl was called Gretel. The family was always poor, but they had enough to eat. One year,
        a famine came to the land. The woodcutter did not have enough food to feed his children. He said to his wife,
        “What is to become of us? How are we to feed our poor children?” “Don’t worry, husband,” answered his wife.
        “Early tomorrow morning we will take Hansel and Gretel deep into the forest. We will light a fire for them. I
        will give each of them one piece of bread, and then we will leave. They will not find their way home again, and
        we shall be rid of them.” She said this because she was not their real mother. She was their stepmother and did
        not like the children. “No,” said the man. “I cannot do that!” “Fool!” said the woman. “Should we all die of
        hunger?” The stepmother kept saying this to the man, so he finally agreed with her. The two children had not
        been able to sleep because they were hungry. They heard what their stepmother had said to their father. Gretel
        cried sadly and whispered, “What can we do?” “Don’t cry, Gretel,” said Hansel.
      </StScript.ContentPlace>
      {/* script 내용이 얼마나 길어질지 알아야함. 학생이 서있는 곳과 스크린의 거리에 맞는 글씨 크기를 이용해야함.
          필요한 내용 1. 스크립트 길이
          2. 학생이 서있는 단상과 스크린의 거리 */}

      <StScript.RoundBtn onClick={openPopup}>시작</StScript.RoundBtn>
      <button onClick={download}>다운로드</button>
    </StScript.Bg>
  );
};

export default Script;

const StScript = {
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
    height: 77px;
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
    padding: 40px;
    height: 90%;
    width: auto;
    background: #ffffff 0% 0%;
    box-shadow: 0px 0px 30px #26c4b121;
    border-radius: 20px;
    z-index: 4;
    justify-content: center;
    margin: 59px 40px 71px 40px;
    align-items: center;
    font: normal normal normal 30px/53px NanumSquareOTF;
    color: #222222;
  `,
  RoundBtn: styled.div`
    background-color: #26c4b1;
    width: 70px;
    height: 70px;
    border-radius: 999px;
    color: #fff;
    cursor: pointer;
  `,
};
