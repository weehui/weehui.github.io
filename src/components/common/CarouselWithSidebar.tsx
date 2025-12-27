"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./CarouselWithSidebar.module.css";

export interface GameItem {
  id: string | number;
  image: string;
  title: string;
  logo?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  badgeColor?: string;
  thumbnailImage?: string;
  path?: string;
  google_store_url?: string,
  apple_store_url?: string,
}

interface CarouselWithSidebarProps {
  games: GameItem[];
  autoPlay?: boolean;              // 是否自动轮播
  autoPlayInterval?: number;       // 每张停留时长（ms）
  onItemClick?: (game: GameItem, index: number) => void;
}

export const CarouselWithSidebar: React.FC<CarouselWithSidebarProps> = ({
  games,
  autoPlay = true,
  autoPlayInterval = 5000,
  onItemClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(() => (games.length > 1 ? 1 : 0)); // track index (with clones)
  const [progress, setProgress] = useState(0); // 0-100
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mainHovered, setMainHovered] = useState(false);
  const [isSmall, setIsSmall] = useState(false);   // ≤768：小屏，侧栏横向
  const [canHover, setCanHover] = useState(false); // 设备是否支持悬停
  const [slideWidth, setSlideWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const hasMultiple = games.length > 1;
  const currentGame = games[currentIndex];

  // ---- DOM refs ----
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ---- state mirrors for interval ----
  const currentIndexRef = useRef(currentIndex);
  const displayIndexRef = useRef(displayIndex);
  const progressRef = useRef(progress);
  const startTimeRef = useRef<number | null>(null);
  const autoPlayRef = useRef(autoPlay);
  const intervalRef = useRef<number | null>(null);
  const autoPlayIntervalRef = useRef(autoPlayInterval);
  const hasMultipleRef = useRef(hasMultiple);
  const mainHoveredRef = useRef(mainHovered);
  const hoveredIndexRef = useRef<number | null>(hoveredIndex);
  const canHoverRef = useRef(canHover);
  const isDraggingRef = useRef(isDragging);
  const dragOffsetRef = useRef(dragOffset);
  const transitionEnabledRef = useRef(transitionEnabled);

  // 防止点击后短时间内 hover 抢占
  const suppressHoverUntilRef = useRef<number>(0);
  const SUPPRESS_HOVER_MS = 600;
  const TRANSITION_MS = 420;
  const transitionFallbackRef = useRef<number | null>(null);

  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { displayIndexRef.current = displayIndex; }, [displayIndex]);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);
  useEffect(() => { autoPlayRef.current = autoPlay; }, [autoPlay]);
  useEffect(() => { autoPlayIntervalRef.current = autoPlayInterval; }, [autoPlayInterval]);
  useEffect(() => { hasMultipleRef.current = hasMultiple; }, [hasMultiple]);
  useEffect(() => { mainHoveredRef.current = mainHovered; }, [mainHovered]);
  useEffect(() => { hoveredIndexRef.current = hoveredIndex; }, [hoveredIndex]);
  useEffect(() => { canHoverRef.current = canHover; }, [canHover]);
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { dragOffsetRef.current = dragOffset; }, [dragOffset]);
  useEffect(() => { transitionEnabledRef.current = transitionEnabled; }, [transitionEnabled]);

  // 主轮播容器宽度（用于拖拽 translate 计算）
  const mainCarouselRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = mainCarouselRef.current;
    if (!el) return;

    const update = () => setSlideWidth(el.getBoundingClientRect().width);
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // track 使用克隆首尾实现无缝循环
  const loopSlides = hasMultiple && games.length > 0
    ? [games[games.length - 1], ...games, games[0]]
    : games;

  const clearTransitionFallback = () => {
    if (transitionFallbackRef.current) {
      window.clearTimeout(transitionFallbackRef.current);
      transitionFallbackRef.current = null;
    }
  };

  const normalizeLoopIndex = (idx: number) => {
    if (idx === 0) return games.length;
    if (idx === games.length + 1) return 1;
    return idx;
  };

  const scheduleNormalizeIfStuckOnClone = () => {
    clearTransitionFallback();
    transitionFallbackRef.current = window.setTimeout(() => {
      if (!hasMultipleRef.current) return;
      if (isDraggingRef.current) return;
      if (!transitionEnabledRef.current) return;

      const idx = displayIndexRef.current;
      if (idx !== 0 && idx !== games.length + 1) return;

      const normalized = normalizeLoopIndex(idx);
      setTransitionEnabled(false);
      transitionEnabledRef.current = false;
      setDisplayIndex(normalized);
      displayIndexRef.current = normalized;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setTransitionEnabled(true);
        transitionEnabledRef.current = true;
      }));
    }, TRANSITION_MS + 80);
  };

  // 在开始下一次交互前，若停在 clone 上，立刻无动画归位，避免后续 transitionEnd/定时器干扰
  const snapFromCloneToRealIfNeeded = () => {
    if (!hasMultipleRef.current) return;
    const idx = displayIndexRef.current;
    if (idx !== 0 && idx !== games.length + 1) return;

    clearTransitionFallback();
    const normalized = normalizeLoopIndex(idx);
    setTransitionEnabled(false);
    transitionEnabledRef.current = false;
    setDisplayIndex(normalized);
    displayIndexRef.current = normalized;
  };

  // 数据源变化时，重置 track 到当前索引对应位置
  useEffect(() => {
    setTransitionEnabled(false);
    setDragOffset(0);
    setIsDragging(false);
    isDraggingRef.current = false;
    dragOffsetRef.current = 0;
    transitionEnabledRef.current = false;
    clearTransitionFallback();

    if (!hasMultiple) {
      setDisplayIndex(currentIndexRef.current);
      displayIndexRef.current = currentIndexRef.current;
    } else {
      setDisplayIndex(currentIndexRef.current + 1);
      displayIndexRef.current = currentIndexRef.current + 1;
    }

    requestAnimationFrame(() => requestAnimationFrame(() => {
      setTransitionEnabled(true);
      transitionEnabledRef.current = true;
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games.length, hasMultiple]);

  // 设备能力 & 小屏监听
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqSmall = window.matchMedia("(max-width: 768px)");
    const update = () => {
      setCanHover(mqHover.matches);
      setIsSmall(mqSmall.matches);
    };
    update();
    mqHover.addEventListener("change", update);
    mqSmall.addEventListener("change", update);
    return () => {
      mqHover.removeEventListener("change", update);
      mqSmall.removeEventListener("change", update);
    };
  }, []);

  // 只滚动 sidebar：计算目标元素在容器内的相对中心，平滑滚动容器
  const scrollActiveIntoView = (idx: number, behavior: ScrollBehavior = "smooth") => {
    const container = sidebarRef.current;
    const el = itemRefs.current[idx];
    if (!container || !el) return;

    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();

    const isHorizontal = container.scrollWidth > container.clientWidth;

    if (isHorizontal) {
      const elCenterX = (eRect.left + eRect.right) / 2;
      const containerLeft = cRect.left;
      const targetCenterInContainer = elCenterX - containerLeft; // 相对容器左侧
      let targetScrollLeft = targetCenterInContainer - container.clientWidth / 2;

      // 目标滚动是相对当前 scrollLeft 的偏移
      targetScrollLeft += container.scrollLeft;

      // clamp
      const maxLeft = container.scrollWidth - container.clientWidth;
      if (targetScrollLeft < 0) targetScrollLeft = 0;
      if (targetScrollLeft > maxLeft) targetScrollLeft = maxLeft;

      container.scrollTo({ left: targetScrollLeft, behavior });
    } else {
      const elCenterY = (eRect.top + eRect.bottom) / 2;
      const containerTop = cRect.top;
      let targetCenterInContainer = elCenterY - containerTop;
      let targetScrollTop = targetCenterInContainer - container.clientHeight / 2;

      targetScrollTop += container.scrollTop;

      const maxTop = container.scrollHeight - container.clientHeight;
      if (targetScrollTop < 0) targetScrollTop = 0;
      if (targetScrollTop > maxTop) targetScrollTop = maxTop;

      container.scrollTo({ top: targetScrollTop, behavior });
    }
  };

  // 统一计时循环：仅挂载一次
  useEffect(() => {
    const TICK_MS = 50;

    const startLoop = () => {
      // 以当前进度反推 startTime，避免跳变
      startTimeRef.current =
        Date.now() - (progressRef.current / 100) * autoPlayIntervalRef.current;

      intervalRef.current = window.setInterval(() => {
        if (!autoPlayRef.current || !hasMultipleRef.current) return;

        const now = Date.now();
        const ignoreHover = now < suppressHoverUntilRef.current;
        const pausedByHover =
          canHoverRef.current &&
          !ignoreHover &&
          (mainHoveredRef.current || hoveredIndexRef.current !== null);
        const paused = isDraggingRef.current || pausedByHover;

        if (!paused) {
          const elapsed = Math.max(0, now - (startTimeRef.current ?? now));
          const p = Math.min((elapsed / autoPlayIntervalRef.current) * 100, 100);

          if (p !== progressRef.current) {
            progressRef.current = p;
            setProgress(p);
          }

          if (p >= 100) {
            const next = (currentIndexRef.current + 1) % games.length;

            if (hasMultipleRef.current) {
              if (currentIndexRef.current === games.length - 1 && next === 0) {
                setDisplayIndex(games.length + 1); // clone first
                displayIndexRef.current = games.length + 1;
              } else {
                setDisplayIndex(next + 1);
                displayIndexRef.current = next + 1;
              }
            } else {
              setDisplayIndex(next);
              displayIndexRef.current = next;
            }
            scheduleNormalizeIfStuckOnClone();

            currentIndexRef.current = next;
            setCurrentIndex(next);

            progressRef.current = 0;
            setProgress(0);
            startTimeRef.current = now;

            // 仅滚 sidebar，不触发页面滚动
            requestAnimationFrame(() => scrollActiveIntoView(next));
          }
        } else {
          // 悬停暂停：更新 startTimeRef 保持进度不走
          startTimeRef.current =
            now - (progressRef.current / 100) * autoPlayIntervalRef.current;
        }
      }, TICK_MS);
    };

    startLoop();

    // 标签页隐藏/显示，避免后台计时漂移
    const onVisibility = () => {
      if (document.hidden) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else {
        if (!intervalRef.current) startLoop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // 仅首挂载
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games.length]);

  // currentIndex 变化时，兜底再滚一次（处理点击切换、响应式横竖切换）
  useEffect(() => {
    const id = requestAnimationFrame(() => scrollActiveIntoView(currentIndex));
    return () => cancelAnimationFrame(id);
  }, [currentIndex, isSmall]);

  // 点击侧栏切换：重置进度并立即滚动
  const handleGameSelect = (index: number, opts?: { direction?: "next" | "prev" | "direct" }) => {
    snapFromCloneToRealIfNeeded();
    if (!transitionEnabledRef.current) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setTransitionEnabled(true);
        transitionEnabledRef.current = true;
      }));
    }

    // 手动交互：无论是否真的切换到不同 index，都重置自动轮播计时
    progressRef.current = 0;
    setProgress(0);
    startTimeRef.current = Date.now();

    suppressHoverUntilRef.current = Date.now() + SUPPRESS_HOVER_MS;

    setHoveredIndex(null);
    hoveredIndexRef.current = null;
    setMainHovered(false);
    mainHoveredRef.current = false;

    if (index === currentIndexRef.current) {
      requestAnimationFrame(() => scrollActiveIntoView(index));
      return;
    }

    if (hasMultipleRef.current) {
      const current = currentIndexRef.current;
      const direction = opts?.direction ?? "direct";
      if (direction === "next" && current === games.length - 1 && index === 0) {
        setDisplayIndex(games.length + 1); // clone first
        displayIndexRef.current = games.length + 1;
      } else if (direction === "prev" && current === 0 && index === games.length - 1) {
        setDisplayIndex(0); // clone last
        displayIndexRef.current = 0;
      } else {
        setDisplayIndex(index + 1);
        displayIndexRef.current = index + 1;
      }
    } else {
      setDisplayIndex(index);
      displayIndexRef.current = index;
    }
    scheduleNormalizeIfStuckOnClone();

    currentIndexRef.current = index;
    setCurrentIndex(index);

    // 立即仅滚 sidebar
    requestAnimationFrame(() => scrollActiveIntoView(index));
  };

  const didDragRef = useRef(false);
  const handleMainClick = () => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    onItemClick?.(currentGame, currentIndex);
  };

  // 悬停（仅桌面）
  const handleSidebarEnter = (idx: number) => {
    if (!canHoverRef.current) return;
    if (Date.now() < suppressHoverUntilRef.current) return;
    setHoveredIndex(idx);
  };
  const handleSidebarLeave = () => {
    if (!canHoverRef.current) return;
    setHoveredIndex(null);
  };
  const handleMainEnter = () => {
    if (!canHoverRef.current) return;
    if (Date.now() < suppressHoverUntilRef.current) return;
    setMainHovered(true);
  };
  const handleMainLeave = () => {
    if (!canHoverRef.current) return;
    setMainHovered(false);
  };

  const dragStateRef = useRef<{
    pointerId: number | null;
    startX: number;
    lastX: number;
    lastT: number;
  }>({
    pointerId: null,
    startX: 0,
    lastX: 0,
    lastT: 0,
  });

  const beginDrag = (e: React.PointerEvent) => {
    if (!hasMultipleRef.current) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    snapFromCloneToRealIfNeeded();
    didDragRef.current = false;
    dragStateRef.current.pointerId = e.pointerId;
    dragStateRef.current.startX = e.clientX;
    dragStateRef.current.lastX = e.clientX;
    dragStateRef.current.lastT = performance.now();

    isDraggingRef.current = true;
    setIsDragging(true);
    setTransitionEnabled(false);
    transitionEnabledRef.current = false;
    setDragOffset(0);
    dragOffsetRef.current = 0;

    suppressHoverUntilRef.current = Date.now() + SUPPRESS_HOVER_MS;
    setHoveredIndex(null);
    setMainHovered(false);

    mainCarouselRef.current?.setPointerCapture(e.pointerId);
  };

  const moveDrag = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    if (dragStateRef.current.pointerId !== e.pointerId) return;
    if (!slideWidth) return;

    const dx = e.clientX - dragStateRef.current.startX;

    if (Math.abs(dx) > 6) didDragRef.current = true;

    setDragOffset(dx);
    dragOffsetRef.current = dx;

    dragStateRef.current.lastX = e.clientX;
    dragStateRef.current.lastT = performance.now();
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    if (dragStateRef.current.pointerId !== e.pointerId) return;

    mainCarouselRef.current?.releasePointerCapture(e.pointerId);
    dragStateRef.current.pointerId = null;

    const dx = dragOffsetRef.current;
    isDraggingRef.current = false;
    setIsDragging(false);
    setTransitionEnabled(true);
    transitionEnabledRef.current = true;
    setDragOffset(0);
    dragOffsetRef.current = 0;

    if (!slideWidth || !hasMultipleRef.current) return;

    const now = performance.now();
    const dt = Math.max(1, now - dragStateRef.current.lastT);
    const vx = (e.clientX - dragStateRef.current.lastX) / dt; // px/ms

    const thresholdPx = slideWidth * 0.18;
    const shouldGoPrev = dx > thresholdPx || vx > 0.65;
    const shouldGoNext = dx < -thresholdPx || vx < -0.65;

    if (shouldGoPrev) {
      const next = (currentIndexRef.current - 1 + games.length) % games.length;
      handleGameSelect(next, { direction: "prev" });
    } else if (shouldGoNext) {
      const next = (currentIndexRef.current + 1) % games.length;
      handleGameSelect(next, { direction: "next" });
    } else {
      // snap back
      if (hasMultipleRef.current) {
        setDisplayIndex(currentIndexRef.current + 1);
        displayIndexRef.current = currentIndexRef.current + 1;
      }
    }
  };

  const onTrackTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "transform") return;
    if (!hasMultipleRef.current) return;
    clearTransitionFallback();

    const idx = displayIndexRef.current;
    if (idx === 0) {
      setTransitionEnabled(false);
      transitionEnabledRef.current = false;
      setDisplayIndex(games.length);
      displayIndexRef.current = games.length;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setTransitionEnabled(true);
        transitionEnabledRef.current = true;
      }));
    } else if (idx === games.length + 1) {
      setTransitionEnabled(false);
      transitionEnabledRef.current = false;
      setDisplayIndex(1);
      displayIndexRef.current = 1;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setTransitionEnabled(true);
        transitionEnabledRef.current = true;
      }));
    }
  };

  const translateX = slideWidth
    ? -displayIndex * slideWidth + (isDragging ? dragOffset : 0)
    : 0;

  return (
    <div className={styles.carouselContainer}>
      {/* 主轮播 */}
      <div
        ref={mainCarouselRef}
        className={`${styles.mainCarousel} ${isDragging ? styles.mainCarouselDragging : ""}`}
        onClick={handleMainClick}
        onMouseEnter={handleMainEnter}
        onMouseLeave={handleMainLeave}
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className={styles.slideTrack}
          onTransitionEnd={onTrackTransitionEnd}
          style={{
            transform: `translate3d(${translateX}px, 0, 0)`,
            transition: transitionEnabled ? "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          }}
        >
          {loopSlides.map((game, idx) => {
            const isVisible = idx === displayIndex;
            const isCurrent = hasMultiple ? idx === currentIndex + 1 : idx === currentIndex;
            return (
              <div
                key={`${game.id}-${idx}`}
                className={styles.slide}
                aria-hidden={!isVisible}
              >
                <div className={styles.backgroundImage}>
                  {game.image && (
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, 70vw"
                      className={styles.bgImage}
                      priority={isCurrent && currentIndex === 0}
                    />
                  )}
                  <div className={styles.overlay} />
                </div>

                <div className={styles.content}>
                  {game.subtitle && <div className={styles.subtitle}>{game.subtitle}</div>}
                  {game.description && <div className={styles.description}>{game.description}</div>}

                  {game.badge && (
                    <div
                      className={styles.badge}
                      style={{
                        backgroundColor: game.badgeColor || "rgba(255, 255, 255, 0.95)",
                        color: game.badgeColor ? "#fff" : "#000",
                      }}
                    >
                      {game.badge}
                    </div>
                  )}

                  {game.google_store_url && (
                    <a
                      className={styles.downloadBtn}
                      href={game.google_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="前往 Google Play 下载"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Image
                        src="/images/button/google_store.png"
                        alt="在 Google Play 获取"
                        width={512}
                        height={153}
                        className={styles.storeImg}
                      />
                    </a>
                  )}

                  {game.apple_store_url && (
                    <a
                      className={styles.downloadBtn}
                      href={game.apple_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="前往 App Store 下载"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Image
                        src="/images/button/apple_store.png"
                        alt="在 App Store 下载"
                        width={512}
                        height={153}
                        className={styles.storeImg}
                      />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 主进度条（小屏显示；hover 仅暂停推进，不隐藏） */}
      {autoPlay && hasMultiple && (
        <div
          className={`${styles.mainProgressBar} ${isSmall ? styles.mainProgressBarShow : ""
            }`}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={styles.mainProgressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* 侧栏（只滚这个容器） */}
      <div className={styles.sidebar} ref={sidebarRef}>
        {games.map((game, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={game.id}
              ref={(el) => {
                itemRefs.current[index] = el; // 仅保存引用
              }}
              className={`${styles.sidebarItem} ${isActive ? styles.active : ""
                } ${hoveredIndex === index ? styles.hovered : ""}`}
              onClick={() => handleGameSelect(index, { direction: "direct" })}
              onMouseEnter={() => handleSidebarEnter(index)}
              onMouseLeave={handleSidebarLeave}
            >
              <div className={styles.thumbnail}>
                {game.thumbnailImage &&
                  <Image
                    src={game.thumbnailImage}
                    alt={game.title}
                    fill
                    sizes="(max-width: 480px) 56px, (max-width: 768px) 64px, 56px"
                    className={styles.thumbnailImage}
                  />
                }

              </div>

              <div className={styles.gameTitle}>{}</div>

              {/* 大屏激活项进度条（hover 仅暂停推进，不隐藏） */}
              {!isSmall && autoPlay && hasMultiple && isActive && (
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {isActive && <div className={styles.activeIndicator} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CarouselWithSidebar;
