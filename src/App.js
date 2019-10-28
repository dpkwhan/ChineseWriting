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
    this.writer = null;
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    const { width } = node.getBoundingClientRect();
    const fontWidth = width - 10;
    this.writer = HanziWriter.create(node, this.props.character, {
      width: fontWidth,
      height: fontWidth,
      padding: 0,
      strokeColor: "#168F16",
      showOutline: true,
      delayBetweenLoops: 1000
    });
    this.writer.loopCharacterAnimation();
  }

  render() {
    const { character } = this.props;
    if (this.writer !== null) {
      this.writer.setCharacter(character);
      this.writer.loopCharacterAnimation();
    }
    return <div style={{ margin: "0 auto", maxWidth: 500 }} />;
  }
}

class CharacterStrokeByStrokePractice extends Component {
  constructor(props, context) {
    super(props, context);
    autoBind(this);
    this.node = null;
    this.fontWidth = null;
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

  paintCharacter(node, fontWidth, character) {
    HanziWriter.loadCharacterData(character).then(charData => {
      while (node.firstChild) {
        node.firstChild.remove();
      }

      for (let i = 0; i < charData.strokes.length; i++) {
        const strokesPortion = charData.strokes.slice(0, i + 1);
        this.renderFanningStrokes(node, strokesPortion);
      }

      const writer = HanziWriter.create(node, character, {
        width: fontWidth,
        height: fontWidth,
        padding: 0
      });
      writer.quiz();
    });
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    const { width } = node.getBoundingClientRect();
    const fontWidth = width - 10;
    this.node = node;
    this.fontWidth = fontWidth;
    this.paintCharacter(node, fontWidth, this.props.character);
  }

  render() {
    const { character } = this.props;
    if (this.node !== null && this.fontWidth !== null) {
      this.paintCharacter(this.node, this.fontWidth, character);
    }

    return <div style={{ margin: "0 auto", maxWidth: 500 }} />;
  }
}

class App extends Component {
  constructor(props, context) {
    super(props, context);
    autoBind(this);
    this.runner = null;
    this.characters = ["我", "要", "学", "汉", "语"];
    this.state = { charIdx: 0 };
  }

  componentDidMount() {
    this.runner = setInterval(() => {
      const charIdx =
        this.state.charIdx === this.characters.length - 1
          ? 0
          : this.state.charIdx + 1;
      this.setState({ charIdx });
    }, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.runner);
  }

  render() {
    const { charIdx } = this.state;
    const character = this.characters[charIdx];

    return (
      <Fragment>
        <Tabs tabPosition="right">
          <TabPane
            tab={
              <div>
                <span>笔 顺 动 画</span>
                <br />
                <span>Stroke Animation</span>
              </div>
            }
            key="1"
          >
            <CharacterAnimation character={character} />
          </TabPane>
          <TabPane
            tab={
              <div>
                <span>描 写 练 习</span>
                <br />
                <span>Stroke Practice</span>
              </div>
            }
            key="2"
          >
            <CharacterStrokeByStrokePractice character={character} />
          </TabPane>
        </Tabs>
      </Fragment>
    );
  }
}

export default App;
