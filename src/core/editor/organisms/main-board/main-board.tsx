import React, { useEffect, useRef, useState } from 'react';
import Panel from '../../molecules/panel/panel';
import styles from './main-board.module.scss';
import Editor from '@monaco-editor/react';
import WrapperFlow from '../../molecules/wrapper-flow/wrapper-flow';
import Header from '../../atoms/top-bar/top-bar';
const mockedCode = `
const model = {
    initialize: function() {
        this.cookies = 4;
		this.caloriesPerCookie = 50;
    },
    update: function() {
        this.calories = this.cookies * this.caloriesPerCookie;
    }
}
`;
const mockedHtml = `
	<p>This is a simple reactive document.</p>

	<p id="example">
		When you eat <span data-var="cookies" class="TKAdjustableNumber" data-min="2" data-max="100"> cookies</span>, you
		will consume <span data-var="calories"></span> calories.
	</p>

`;
const MainBoard = () => {
  const [code, setCode] = useState(mockedCode);
  const [htmlCode, setHtmlCode] = useState(mockedHtml);
  const draggableRef = useRef<HTMLHRElement>(null);
  const [leftPorcent, setPorcent] = useState(30);
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

  return (
    <div>
      <Header />
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
          <WrapperFlow model={code} html={htmlCode} />
        </Panel>
      </div>
    </div>
  );
};
export default MainBoard;
