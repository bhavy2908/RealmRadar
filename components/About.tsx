import React from "react";
import { CustomNodeData } from "./CustomNode";

interface AboutProps {
  firstNodeData: CustomNodeData;
  aiFact: string | null;
}

const About: React.FC<AboutProps> = ({ firstNodeData, aiFact }) => {
  return (
    <div className="about">
      <h1>About</h1>
      <hr style={{ border: "1px solid #4caf50" }}></hr>
      <div className="data">
        <div className="data-row">
          <b>Label: </b>
          {firstNodeData.label}
        </div>
        <div className="data-row">
          <b>Type: </b>
          {firstNodeData.type}
        </div>
        {firstNodeData.gender && (
          <div className="data-row">
            <b>Gender: </b>
            {firstNodeData.gender}
          </div>
        )}
        {firstNodeData.culture && (
          <div className="data-row">
            <b>Culture: </b>
            {firstNodeData.culture}
          </div>
        )}
        {firstNodeData.born && (
          <div className="data-row">
            <b>Born: </b>
            {firstNodeData.born}
          </div>
        )}
        {firstNodeData.coat_of_arms && (
          <div className="data-row">
            <b>Symbol: </b>
            {firstNodeData.coat_of_arms}
          </div>
        )}
        {firstNodeData.words && (
          <div className="data-row">
            <b>Words: </b>
            {firstNodeData.words}
          </div>
        )}
        {firstNodeData.region && (
          <div className="data-row">
            <b>Region: </b>
            {firstNodeData.region}
          </div>
        )}

        {aiFact && (
          <div>
            <div className="data-row" style={{ marginTop: "10px" }}>
              <b>Did you know?</b>
            </div>
            <div className="data-row" style={{ textAlign: "left" }}>
              {aiFact}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
