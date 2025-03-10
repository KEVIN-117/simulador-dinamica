import React, { useEffect, useRef, useState } from 'react';
import Panel from '../../molecules/panel/panel';
import styles from './main-board.module.scss';
import Editor from '@monaco-editor/react';
import WrapperFlow from '../../molecules/wrapper-flow/wrapper-flow';
import Header from '../../atoms/top-bar/top-bar';
const mockedCode = `

const model = {
  initialize: function () {
      this.x0 = 0;
      this.finalTime = 100;
      this.dt = 1;
      this.k = 0.034;
      this.xd = 40;
      this.initTime = 0;
      Plotly.newPlot(negative, [], {title: 'Negative', margin: {t: 30}})
  }, 
  update: function () {
      this.x = this.x0;
      this.time = this.initTime = 0;
      const xData = [];
      const timeData = [];
      for (this.time = this.initTime; this.time < this.finalTime; this.time += this.dt) {
          this.x += ((this.xd - this.x) * this.k ) * this.dt;
          xData.push(this.x);
          timeData.push(this.time);
      }
      const data = [
          {
              x: timeData,
              y: xData,
              mode: 'lines',
              type: 'scatter'
          }
      ]
      console.log(data);
      Plotly.react(negative, data, {title: "negative"});
  }
}

`;
const mockedHtml = `
<p>This is a simple reactive document.</p>
<p id="example">
  Final Time <span data-var="finalTime" class="TKAdjustableNumber" data-min="2" data-max="300"> cookies</span>, you
  will consume <span data-var="calories"></span> calories.
</p>
<div id='negative' class='plotly' data-plotly='data'></div>

`;
const MainBoard = () => {
  const [code, setCode] = useState(mockedCode);
  const [play, setPlay] = useState(false);
  const [htmlCode, setHtmlCode] = useState(mockedHtml);
  const draggableRef = useRef<HTMLHRElement>(null);
  const [leftPorcent, setPorcent] = useState(50);
  const mouseDown = useRef(false);
  const [isMouseMove, setMouseMove] = useState(false);
  useEffect(() => {
    draggableRef.current?.addEventListener('mousedown', (e) => {
      mouseDown.current = true;
    });
    draggableRef.current?.addEventListener('mouseup', (e) => {
      console.log('false');
      mouseDown.current = false;
      setMouseMove(false);
    });
    document.addEventListener('mousemove', (e) => {
      if (mouseDown.current) {
        console.log('moveee');
        setMouseMove(true);
        e.preventDefault();
        window.innerWidth;
        let porcent = Math.ceil((e.clientX * 100) / window.innerWidth);
        setPorcent(porcent);
      }
    });
    document.addEventListener('mouseup', (e) => {
      mouseDown.current = false;
      setMouseMove(false);
    });

    return () => {
      document.removeEventListener('mousemove', () => {});
      document.removeEventListener('mouseup', () => {});
      draggableRef.current?.removeEventListener('mousedown', () => {});
      draggableRef.current?.removeEventListener('mouseup', () => {});
    };
  }, []);
  const handlerPlay = (isPlay: boolean) => {
    console.log('is play ', isPlay);
    setPlay(isPlay);
  };
  return (
    <div>
      <Header play={handlerPlay} />
      <div className={styles.container}>
        <Panel width={`${leftPorcent}%`}>
          <Editor
            height='50vh'
            defaultLanguage='javascript'
            defaultValue='const model = { }'
            theme='vs-dark'
            value={code}
            onChange={(value) => setCode(value || '')}
          />
          <Editor
            height='50vh'
            defaultLanguage='html'
            defaultValue='<div></div>'
            value={htmlCode}
            onChange={(value) => setHtmlCode(value || '')}
          />
        </Panel>
        <hr ref={draggableRef} className={styles.draggable} />
        <Panel width={`${100 - leftPorcent}%`}>
          {isMouseMove && <div className={styles.overlay}></div>}
          <WrapperFlow model={code} html={htmlCode} isPlay={play} />
        </Panel>
      </div>
    </div>
  );
};
export default MainBoard;
