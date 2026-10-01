import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [followerPosition, setFollowerPosition] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const onMouseEnter = () => setVisible(true);
    const onMouseLeave = () => setVisible(false);

    // Follower smooth lerp
    const updateFollower = () => {
      setFollowerPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        };
      });
      animationFrameId = requestAnimationFrame(updateFollower);
    };

    animationFrameId = requestAnimationFrame(updateFollower);

    // Detect hovering over clickable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('clickable')
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseenter', onMouseEnter);
    document.body.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseenter', onMouseEnter);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [position.x, position.y, visible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    // Touch device, don't show cursor
    return null;
  }

  return (
    <>
      <div
        className={`custom-cursor ${visible ? 'active' : ''} ${hovering ? 'hovering' : ''}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      />
      <div
        className={`custom-cursor-follower ${visible ? 'active' : ''}`}
        style={{
          transform: `translate3d(${followerPosition.x}px, ${followerPosition.y}px, 0) translate(-50%, -50%)`,
          width: hovering ? 54 : 36,
          height: hovering ? 54 : 36,
        }}
      />
    </>
  );
};
