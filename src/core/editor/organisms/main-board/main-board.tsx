import React, { useEffect, useRef, useState } from 'react';
import Panel from '../../molecules/panel/panel';
import styles from './main-board.module.scss';
import Editor from '@monaco-editor/react';
import WrapperFlow from '../../molecules/wrapper-flow/wrapper-flow';
import Header from '../../atoms/top-bar/top-bar';
import IframeViewer from '../../molecules/iframe-loader/iframeLoader';
const mockedCode = `
const model = {
  initialize: function () {
      this.x0 = 5;
      this.y0 = 10;
      this.finalTime = 100;
      this.dt = 0.0625;
      this.k1 = 0.34;
      this.k2 = 0.32
      this.k3 = 0.2;
      this.k4  = 0.43;
      this.initTime = 0;
  }, 
  update: function () {
      this.x = this.x0;
      this.y = this.y0;
      this.time = this.initTime = 0;
      for (this.time = this.initTime; this.time < this.finalTime; this.time += this.dt) {
          this.f1 = this.x * this.k1 * this.y;
          this.f2 = this.x * this.k2;
          this.f3  = this.y * this.k3;
          this.f4 = this.y * this.k4 * this.x;
          this.x = this.x + (this.f1 - this.f2) * this.dt;
          this.y = this.y + (this.f3 - this.f4) * this.dt; 
          
      }
  }
}


`;
const mockedHtml = `

<p>This is a simple reactive document.</p>
<p id="example">
  Final Time <span data-var="finalTime" class="TKAdjustableNumber" data-min="2" data-max="300"> cookies</span>, you
  poblacion inicial <span data-var="x0" class="TKAdjustableNumber" data-min="0" data-ma="100", data-step="1"></span>
poblacion inicial <span data-var="y0" class="TKAdjustableNumber" data-min="0" data-ma="100", data-step="1"></span>

</p>
<div id='negative' class='plotly'  data-plotly='[time, x]'></div>

`;
const MainBoard = () => {
  const [code, setCode] = useState(mockedCode);
  const [play, setPlay] = useState(false);
  const [isVisibleForrester, setVisibleForrester] = useState(false);
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
      mouseDown.current = false;
      setMouseMove(false);
    });
    document.addEventListener('mousemove', (e) => {
      if (mouseDown.current) {
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
  const handlerForrester  = (isVisible: boolean) => {
    setVisibleForrester(isVisible);
  } 
  return (
    <div>
      <Header play={handlerPlay} visibleForrester={handlerForrester} />
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
          <IframeViewer src='/forrester' title='Iframe Example' isVisibleForrester={isVisibleForrester}/>
          {isMouseMove && <div className={styles.overlay}></div>}
          <WrapperFlow model={code} html={htmlCode} isPlay={play} />
        </Panel>
      </div>
    </div>
  );
};
export default MainBoard;
