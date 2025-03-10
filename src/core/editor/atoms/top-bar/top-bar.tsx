import React from 'react';
import type { HeaderProps } from './top-bar.types';
import styles from './top-bar.module.scss';

const Header = (props: HeaderProps) => {
  const { user, play } = props;
  const [playText, setPlayText] = React.useState(false);
  const handlerPlay = () => {
    setPlayText(!playText);
    play(!playText);
  };
  return (
    <div className={styles.header}>
      <button onClick={handlerPlay}>Play</button>
      <h1>{user?.name}</h1>
    </div>
  );
};
export default Header;
