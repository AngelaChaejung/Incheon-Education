import React from "react";
import Cam from "./Cam";
import Script from "./Script";
import { styled } from "styled-components";

const Whole = () => {
  return (
    <StWhole>
      <Cam />
      <Script />
    </StWhole>
  );
};

export default Whole;

const StWhole = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;
