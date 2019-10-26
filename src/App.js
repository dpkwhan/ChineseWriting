import React, { Component, Fragment } from "react";
import HanziWriter from "hanzi-writer";
import "./App.css";

class App extends Component {
  componentDidMount() {
    const writer1 = HanziWriter.create("character-target-div", "测", {
      width: 300,
      height: 300,
      padding: 0,
      strokeColor: "#168F16", // pink
      delayBetweenStrokes: 30, // milliseconds
      showOutline: true
    });
    writer1.animateCharacter();

    const writer2 = HanziWriter.create("character-target-div-quiz", "测", {
      width: 300,
      height: 300,
      showCharacter: false,
      padding: 0
    });
    writer2.quiz({
      onMistake: function(strokeData) {
        console.log("Mistake on stroke " + strokeData.strokeNum);
      },
      onComplete: function(summaryData) {
        document.getElementById("result").innerHTML = "Good job!";
      }
    });
  }

  render() {
    return (
      <Fragment>
        <div id="character-target-div" className="center-div"></div>
        <div id="character-target-div-quiz" className="center-div"></div>
        <div id="result" className="center-div"></div>
      </Fragment>
    );
  }
}

export default App;
