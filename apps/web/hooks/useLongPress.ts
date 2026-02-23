import { type MouseEvent, type TouchEvent, useCallback, useRef } from 'react';

type PressEvent = MouseEvent | TouchEvent;

type LongPressOptions = {
  onStart?: (event: PressEvent) => void;
  onFinish?: (event: PressEvent) => void;
  onCancel?: (event: PressEvent) => void;
  threshold?: number;
};

type LongPressResult = {
  onMouseDown: (e: MouseEvent) => void;
  onMouseMove: (e: MouseEvent) => void;
  onMouseUp: (e: MouseEvent) => void;
  onMouseLeave: (e: MouseEvent) => void;
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
};

/**
 * Custom hook for detecting long press events, similar to @uidotdev/usehooks implementation
 * @param callback - Function to execute on longpress
 * @param options - Configuration options
 * @returns Event handlers to spread on the target element
 */
const useLongPress = (
  callback: (event: PressEvent) => void,
  options: LongPressOptions = {}
): LongPressResult => {
  const {
    onStart = () => {},
    onFinish = () => {},
    onCancel = () => {},
    threshold = 500,
  } = options;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isPressed = useRef<boolean>(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const start = useCallback(
    (event: PressEvent) => {
      // Works for mouse and touch events
      const point = 'touches' in event ? event.touches[0] : event;
      startPosRef.current = { x: point.clientX, y: point.clientY };

      if (isPressed.current) {
        return;
      }

      isPressed.current = true;
      onStart(event);

      timerRef.current = setTimeout(() => {
        callback(event);
        isPressed.current = false;
        onFinish(event);
      }, threshold);
    },
    [callback, onStart, onFinish, threshold]
  );

  const cancel = useCallback(
    (event: PressEvent) => {
      if (!isPressed.current) {
        return;
      }

      isPressed.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      onCancel(event);
    },
    [onCancel]
  );

  const handleMove = useCallback(
    (event: PressEvent) => {
      if (!isPressed.current) {
        return;
      }

      // Check if the movement is significant enough to cancel
      const point = 'touches' in event ? event.touches[0] : event;
      const moveThreshold = 10;
      const movedX = Math.abs(point.clientX - startPosRef.current.x);
      const movedY = Math.abs(point.clientY - startPosRef.current.y);

      if (movedX > moveThreshold || movedY > moveThreshold) {
        cancel(event);
      }
    },
    [cancel]
  );

  const handleEnd = useCallback(
    (event: PressEvent) => {
      if (!isPressed.current) {
        return;
      }

      isPressed.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      onFinish(event);
    },
    [onFinish]
  );

  return {
    onMouseDown: start as (e: MouseEvent) => void,
    onMouseMove: handleMove as (e: MouseEvent) => void,
    onMouseUp: handleEnd as (e: MouseEvent) => void,
    onMouseLeave: cancel as (e: MouseEvent) => void,
    onTouchStart: start as (e: TouchEvent) => void,
    onTouchMove: handleMove as (e: TouchEvent) => void,
    onTouchEnd: handleEnd as (e: TouchEvent) => void,
  };
};

export default useLongPress;
