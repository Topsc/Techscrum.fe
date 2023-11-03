import React from 'react';
import style from './NavBottom.module.scss';

export default function NavBottom() {
  return (
    <div className={style.container}>
      <span>You&apos;re in a team-managed project</span>
      <span className={style.containerSpan}>
        <button type="button">Learn more</button>
      </span>
    </div>
  );
}
