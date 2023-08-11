import React, { useEffect, useState } from "react";
import VideoProcessor from "./camcomponents/VideoProcessor";
import Swal from "sweetalert2";

const Cam = () => {
  // 배경색상 옵션은 세개입니다. Green을 선택하면 크로마키의 key색상이 "G", Blue는 "B", None을 선택하면 "N"이되며 크로마키가 적용되지 않은 캠 그대로를 보여줍니다
  const [takePlace, setTakePlace] = useState(false);
  const [keyColor, setKeyColor] = useState("G");

  useEffect(() => {
    if (takePlace === true) {
      const openOption = () => {
        Swal.fire({
          title: "배경색상을 선택하세요.",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Green",
          cancelButtonText: "None",
          denyButtonText: "Blue",
          confirmButtonColor: "green",
          denyButtonColor: "blue",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            setKeyColor("G");
            setTakePlace("false");
          } else if (result.isDenied) {
            setKeyColor("B");
            setTakePlace("false");
          } else {
            setKeyColor("N");
            setTakePlace("false");
          }
        });
      };
      openOption();
    }
  }, [takePlace]);
  return (
    <>
      {keyColor === "G" && <VideoProcessor setTakePlace={setTakePlace} keyRgb={[47, 190, 210]} />}
      {/* 47, 180, 210 */}
      {keyColor === "B" && <VideoProcessor setTakePlace={setTakePlace} keyRgb={[36, 108, 239]} />}
      {/* 파란색 스크린을 현장에서 캠에서 인식되는 RGB에 따라 설정 */}
      {keyColor === "N" && <VideoProcessor setTakePlace={setTakePlace} keyRgb={[]} />}
    </>
  );
};

export default Cam;
