"use client"
import React from 'react';
import styles from './PageHeader.module.css';
import Header from './common/header';

interface EpicGamesHeaderProps {
  installButtonText?: string;
  onTitleClick?: () => void;
  onInstallClick?: () => void;
  onMenuClick?: () => void;
}

export const EpicGamesHeader: React.FC<EpicGamesHeaderProps> = ({
  installButtonText = '安装',
  onTitleClick,
  onInstallClick,
  onMenuClick,
}) => {

  // 右侧内容：安装按钮 + 菜单图标
  const rightContent = (
    <div className={styles.rightSlot}>
      {/* <button
        className={styles.installBtn}
        onClick={onInstallClick}
        type="button"
      >
        {installButtonText}
      </button> */}

      <button
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Open menu"
        type="button"
      >
        <span className={styles.menuLine}></span>
        <span className={styles.menuLine}></span>
        <span className={styles.menuLine}></span>
      </button>
    </div>
  );

  return (
    <Header
      right={rightContent}
      fixed={true}
      height={72}
      showBorder={false}
    />
  );
};

export default EpicGamesHeader;
