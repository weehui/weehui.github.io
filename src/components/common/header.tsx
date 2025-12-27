import React, { ReactNode } from 'react';
import styles from './Header.module.css';

export interface HeaderProps {
  /**
   * 左侧内容
   */
  left?: ReactNode;
  
  /**
   * 中间内容
   */
  center?: ReactNode;
  
  /**
   * 右侧内容
   */
  right?: ReactNode;
  
  /**
   * 是否固定在顶部
   */
  fixed?: boolean;
  
  /**
   * 背景颜色
   */
  backgroundColor?: string;
  
  /**
   * 高度
   */
  height?: number | string;
  
  /**
   * 是否显示底部边框
   */
  showBorder?: boolean;
  
  /**
   * 自定义类名
   */
  className?: string;
  
  /**
   * z-index 层级
   */
  zIndex?: number;
}

export const Header: React.FC<HeaderProps> = ({
  left,
  center,
  right,
  fixed = false,
  backgroundColor,
  height = 60,
  showBorder = false,
  className = '',
  zIndex = 100,
}) => {
  const headerStyle: React.CSSProperties = {
    backgroundColor,
    height: typeof height === 'number' ? `${height}px` : height,
    zIndex,
  };

  return (
    <header
      className={`${styles.header} ${fixed ? styles.fixed : ''} ${showBorder ? styles.bordered : ''} ${className}`}
      style={headerStyle}
    >
      <div className={styles.headerLeft}>
        {left}
      </div>
      
      <div className={styles.headerCenter}>
        {center}
      </div>
      
      <div className={styles.headerRight}>
        {right}
      </div>
    </header>
  );
};

export default Header;