import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import autoBind from "react-autobind";
import HanziWriter from "hanzi-writer";
import { Tabs } from "antd";
import "./App.css";
const { TabPane } = Tabs;

class CharacterAnimation extends Component {
  constructor(props, context) {
    super(props, context);
    autoBind(this);
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    const { width } = node.getBoundingClientRect();
    const fontWidth = width - 10;
    const writer = HanziWriter.create(node, this.props.character, {
      width: fontWidth,
      height: fontWidth,
      padding: 0,
      strokeColor: "#168F16",
      showOutline: true,
      delayBetweenLoops: 1000
    });
    writer.loopCharacterAnimation();
  }

  render() {
    return <div style={{ margin: "auto" }} />;
  }
}

class CharacterStrokeByStrokePractice extends Component {
  constructor(props, context) {
    super(props, context);
    autoBind(this);
  }

  renderFanningStrokes(target, strokes) {
    const { width } = target.getBoundingClientRect();
    const marginLeft = 3;
    const svgWidth = Math.floor(width / 5 - marginLeft);
    const svgLink = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgLink, "svg");
    svg.style.width = `${svgWidth}px`;
    svg.style.height = `${svgWidth}px`;
    svg.style.border = "1px solid #EEE";
    svg.style.marginLeft = `${marginLeft}px`;
    target.appendChild(svg);
    const group = document.createElementNS(svgLink, "g");

    // set the transform property on the g element so the character renders at 75x75
    const transformData = HanziWriter.getScalingTransform(svgWidth, svgWidth);
    group.setAttributeNS(null, "transform", transformData.transform);
    svg.appendChild(group);

    strokes.forEach(strokePath => {
      const path = document.createElementNS(svgLink, "path");
      path.setAttributeNS(null, "d", strokePath);
      path.style.fill = "#555"; // style the character paths
      group.appendChild(path);
    });
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    const { width } = node.getBoundingClientRect();
    const fontWidth = width - 10;

    HanziWriter.loadCharacterData(this.props.character).then(charData => {
      for (let i = 0; i < charData.strokes.length; i++) {
        const strokesPortion = charData.strokes.slice(0, i + 1);
        this.renderFanningStrokes(node, strokesPortion);
      }

      const writer = HanziWriter.create(node, this.props.character, {
        width: fontWidth,
        height: fontWidth,
        padding: 0
      });
      writer.quiz();
    });
  }

  render() {
    return <div />;
  }
}

class App extends Component {
  constructor(props, context) {
    super(props, context);
    autoBind(this);
    this.chineseCharacter = "汉";
  }

  render() {
    return (
      <Fragment>
        <Tabs tabPosition="right" onChange={this.changeTab}>
          <TabPane tab="笔顺动画" key="1">
            <CharacterAnimation character={this.chineseCharacter} />
          </TabPane>
          <TabPane tab="描写练习" key="3">
            <CharacterStrokeByStrokePractice
              character={this.chineseCharacter}
            />
          </TabPane>
        </Tabs>
      </Fragment>
    );
  }
}

export default App;
