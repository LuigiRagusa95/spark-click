import { forwardRef, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import { mergeRefs } from './cursor.utils';
import { useSparks } from './cursor.hooks';

export const Cursor = forwardRef<HTMLDivElement>((props, ref) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const createSparks = useSparks({ total: 5, width: 12, distance: 16 });

  useGSAP(() => {
    const isTouchDevice = 'ontouchstart' in window;

    if (isTouchDevice) return;

    const cursorXSetter = gsap.quickTo(cursorRef.current, 'x', { duration: 0.2, ease: 'power3' });
    const cursorYSetter = gsap.quickTo(cursorRef.current, 'y', { duration: 0.2, ease: 'power3' });

    window.addEventListener('pointerdown', (e) => {
      createSparks({ x: e.pageX, y: e.pageY });
    });

    window.addEventListener('mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;

      cursorXSetter(x);
      cursorYSetter(y);
    });
  }, []);

  return <div className="cursor" ref={mergeRefs([cursorRef, ref])} {...props} />;
});
