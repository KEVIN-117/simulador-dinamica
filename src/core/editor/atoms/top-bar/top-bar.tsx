import React from 'react';
import type { HeaderProps } from './top-bar.types';
import styles from './top-bar.module.scss';

const header = (props: HeaderProps) => {
  const { onLogin, onCreateAccount, onLogout, user } = props;
  return (
    <div className={styles.header}>
      <h1>{user?.name}</h1>
    </div>
  );
};
export default header;
