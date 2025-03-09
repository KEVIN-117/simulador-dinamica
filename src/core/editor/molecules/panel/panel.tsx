import React from 'react';
import type { PanelProps } from './panel.types';
import styles from './panel.module.scss';

const panel = (props: PanelProps) => {
  const { children, width } = props;
  return (
    <div
      className={styles.container}
      style={{ '--panel-width': width } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default panel;
