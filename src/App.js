import React, { Component, Fragment } from "react";
import HanziWriter from "hanzi-writer";
import "./App.css";

class App extends Component {
  componentDidMount() {
    const writer1 = HanziWriter.create("character-target-div", "测", {
      width: 300,
      height: 300,
      padding: 0,
      delayBetweenStrokes: 10, // milliseconds
      showOutline: true
    });
    writer1.animateCharacter();

    const writer2 = HanziWriter.create("character-target-div-quiz", "测", {
      width: 300,
      height: 300,
      showCharacter: false,
      padding: 0
    });
    writer2.quiz();
  }

  render() {
    return (
      <Fragment>
        <div id="character-target-div" textalign="center"></div>
        <div id="character-target-div-quiz" textalign="center"></div>
      </Fragment>
    );
  }
}

export default App;
