import React, { useEffect, useRef, useState } from 'react';
import Panel from '../../molecules/panel/panel';
import styles from './draggable-divider.module.scss';
import Editor from '@monaco-editor/react';
const DraggableDivider = () => {
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
    <div className={styles.container}>
      <Panel width={`${leftPorcent}%`}>
        <Editor
          height='90vh'
          defaultLanguage='javascript'
          defaultValue='// some comment'
        />
      </Panel>
      <hr ref={draggableRef} className={styles.draggable} />
      <Panel width={`${100 - leftPorcent}%`}>
        <div>Panel 2</div>
      </Panel>
    </div>
  );
};
export default DraggableDivider;
