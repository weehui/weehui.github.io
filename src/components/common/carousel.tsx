"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./carousel.module.css";

export interface CarouselItem {
  id: string | number;
  image: string;
  logo?: string;
  subtitle?: string;
  title: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  itemWidth?: number;        // 每项占容器宽度比例（%）
  gap?: number;              // 每项间距（px）
  aspectRatio?: string;      // 例如 "9/12"
  onItemClick?: (item: CarouselItem) => void;
  onAddClick?: (item: CarouselItem) => void;

  // 防误触&阈值（越大越不易切页）
  swipeDistanceRatio?: number; // 距离阈值（占单卡宽度比例），默认 0.35
  swipeMinPx?: number;         // 最小像素阈值，默认 24px
  swipeVelocity?: number;      // 速度阈值 px/ms（约等于 800px/s = 0.8），默认 0.8
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = false,
  autoPlayInterval = 3000,
  showDots = true,
  itemWidth = 85,
  gap = 16,
  aspectRatio = "9/12",
  onItemClick,
  onAddClick,
  swipeDistanceRatio = 0.35,
  swipeMinPx = 24,
  swipeVelocity = 0.8,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragDelta, setDragDelta] = useState(0); // 实时拖动位移（px）
  const [isDragging, setIsDragging] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false); // 用于暂停自动播放
  const containerRef = useRef<HTMLDivElement>(null);

  // 滑动起点/速度采样
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0); // px/ms

  // 计算单卡像素宽度（基于容器宽度）
  const getItemWidthPx = () => {
    const w = containerRef.current?.clientWidth ?? 0;
    return (w * itemWidth) / 100;
  };

  // 自动播放（交互时暂停）
  useEffect(() => {
    if (!autoPlay || isInteracting || items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % items.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isInteracting, items.length]);

  const goTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    setCurrentIndex(clamped);
  };

  // ---- Pointer Events：统一触摸/鼠标 ----
  const onPointerDown = (e: React.PointerEvent) => {
    if (items.length <= 1) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    setIsInteracting(true);
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    setDragDelta(0);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const now = performance.now();
    const dx = e.clientX - startXRef.current; // 向左为负，向右为正
    setDragDelta(dx);

    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      const vx = (e.clientX - lastXRef.current) / dt; // px/ms
      velocityRef.current = velocityRef.current * 0.7 + vx * 0.3; // 简单低通
    }
    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
  };

  const finishInteractionSoon = () => {
    setTimeout(() => setIsInteracting(false), 250);
  };

  const onPointerUpOrLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const widthPx = getItemWidthPx();
    const distanceThreshold = Math.max(widthPx * swipeDistanceRatio, swipeMinPx);
    const speedThreshold = swipeVelocity;

    const dx = dragDelta;
    const v = velocityRef.current;

    let next = currentIndex;

    // 只有“明显滑动”才切页（满足速度或距离任一阈值）
    if (Math.abs(v) > speedThreshold || Math.abs(dx) > distanceThreshold) {
      next = dx < 0 ? currentIndex + 1 : currentIndex - 1;
    }

    goTo(next);
    setDragDelta(0); // 回弹
    finishInteractionSoon();
  };

  // 基础位移（px）：按索引计算
  const baseTranslateX = (() => {
    const widthPx = getItemWidthPx();
    return -currentIndex * (widthPx + gap);
  })();

  // 实时位移 = 基础位移 + 拖动增量
  const liveTranslateX = baseTranslateX + dragDelta;

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleItemClick = (item: CarouselItem) => {
    // 小于 5px 视为点击，否则认为是拖动
    if (Math.abs(dragDelta) > 5) return;
    onItemClick?.(item);
  };

  return (
    <div className={styles.carouselSection}>
      <div className={styles.carouselOuter}>
        <div className={styles.carouselContainer} ref={containerRef}>
          <div
            className={styles.carouselWrapper}
            style={{
              display: "flex",
              gap: `${gap}px`,
              transform: `translateX(${liveTranslateX}px)`,
              transition: isDragging ? "none" : "transform 300ms ease",
              touchAction: "pan-y", // 允许纵向滚动，横向我们自己处理
              willChange: "transform",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUpOrLeave}
            onPointerCancel={onPointerUpOrLeave}
            onPointerLeave={onPointerUpOrLeave}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className={styles.carouselItem}
                style={{
                  minWidth: `${itemWidth}%`,
                  aspectRatio,
                  userSelect: "none",
                  cursor: isDragging ? "grabbing" : "grab",
                }}
                onClick={() => handleItemClick(item)}
                aria-current={index === currentIndex}
              >
                <div className={styles.imageWrapper}>
                  {item.image &&
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className={styles.carouselImage}
                      draggable={false}
                      priority={index === 0}
                    />
                  }
                </div>

                <div className={styles.carouselContent}>
                  {item.logo && (
                    <div className={styles.logoWrapper}>
                      <Image
                        src={item.logo}
                        alt="Game logo"
                        width={120}
                        height={40}
                        className={styles.gameLogo}
                      />
                    </div>
                  )}

                  {item.subtitle && (
                    <div className={styles.carouselSubtitle}>{item.subtitle}</div>
                  )}

                  <div className={styles.carouselTitle}>{item.title}</div>
                </div>
              </div>
            ))}
          </div>

          {showDots && items.length > 1 && (
            <div className={styles.carouselDots}>
              {items.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ""
                    }`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  type="button"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
