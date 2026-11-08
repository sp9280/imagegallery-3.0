// Touch Gesture Utilities for Mobile Interactions
import { useState } from 'react';

export const detectSwipe = (touchStart, touchEnd, threshold = 50) => {
  const deltaX = touchEnd.x - touchStart.x;
  const deltaY = touchEnd.y - touchStart.y;
  
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  
  if (absX > absY && absX > threshold) {
    return deltaX > 0 ? 'right' : 'left';
  } else if (absY > absX && absY > threshold) {
    return deltaY > 0 ? 'down' : 'up';
  }
  
  return null;
};

export const detectPinch = (touch1Start, touch1End, touch2Start, touch2End) => {
  const startDistance = Math.hypot(
    touch2Start.x - touch1Start.x,
    touch2Start.y - touch1Start.y
  );
  
  const endDistance = Math.hypot(
    touch2End.x - touch1End.x,
    touch2End.y - touch1End.y
  );
  
  const scale = endDistance / startDistance;
  
  return {
    scale,
    type: scale > 1 ? 'zoom-in' : 'zoom-out'
  };
};

export const useTouchHandlers = (callbacks = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinch,
    onTap,
    onDoubleTap,
    onLongPress
  } = callbacks;

  let touchStart = null;
  let touchEnd = null;
  let lastTap = null;
  let longPressTimer = null;
  let touches = {};

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStart = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    
    // Store all touches for multi-touch gestures
    Array.from(e.touches).forEach(t => {
      touches[t.identifier] = { x: t.clientX, y: t.clientY };
    });

    // Long press detection
    if (onLongPress) {
      longPressTimer = setTimeout(() => {
        onLongPress(touchStart);
      }, 500);
    }

    // Double tap detection
    if (onDoubleTap && lastTap && Date.now() - lastTap < 300) {
      onDoubleTap(touchStart);
      lastTap = null;
    }
  };

  const handleTouchMove = (e) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }

    touchEnd = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    // Update touches for pinch detection
    Array.from(e.touches).forEach(t => {
      if (touches[t.identifier]) {
        touches[t.identifier] = { x: t.clientX, y: t.clientY };
      }
    });
  };

  const handleTouchEnd = (e) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }

    if (!touchStart || !touchEnd) {
      // It was a tap
      if (onTap) {
        onTap(touchStart);
      }
      lastTap = Date.now();
      return;
    }

    // Detect swipe
    const swipeDirection = detectSwipe(touchStart, touchEnd);
    
    switch (swipeDirection) {
      case 'left':
        onSwipeLeft && onSwipeLeft();
        break;
      case 'right':
        onSwipeRight && onSwipeRight();
        break;
      case 'up':
        onSwipeUp && onSwipeUp();
        break;
      case 'down':
        onSwipeDown && onSwipeDown();
        break;
      default:
        break;
    }

    touchStart = null;
    touchEnd = null;
    touches = {};
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };
};

// Hook for handling image zoom with pinch gestures
export const useImageZoom = (initialScale = 1, minScale = 1, maxScale = 4) => {
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  let lastTouchDistance = null;
  let lastPosition = null;

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      lastTouchDistance = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
    } else if (e.touches.length === 1 && scale > minScale) {
      lastPosition = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastTouchDistance) {
      e.preventDefault();
      
      const currentDistance = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
      
      const newScale = Math.min(
        maxScale,
        Math.max(minScale, scale * (currentDistance / lastTouchDistance))
      );
      
      setScale(newScale);
      lastTouchDistance = currentDistance;
    } else if (e.touches.length === 1 && lastPosition && scale > minScale) {
      e.preventDefault();
      
      setPosition({
        x: e.touches[0].clientX - lastPosition.x,
        y: e.touches[0].clientY - lastPosition.y
      });
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistance = null;
    lastPosition = null;
    
    if (scale <= minScale) {
      setScale(minScale);
      setPosition({ x: 0, y: 0 });
    }
  };

  const reset = () => {
    setScale(initialScale);
    setPosition({ x: 0, y: 0 });
  };

  return {
    scale,
    position,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    reset,
    zoomIn: () => setScale(Math.min(maxScale, scale + 0.5)),
    zoomOut: () => setScale(Math.max(minScale, scale - 0.5))
  };
};

// Detect if device supports touch
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Add haptic feedback (vibration) if supported
export const hapticFeedback = (pattern = [10]) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};