import { useEffect, useRef } from 'react';

type Props = { total: number; width: number; distance: number };

export const useSparks = ({ total, width, distance }: Props) => {
  const stylesheetRef = useRef<HTMLStyleElement | null>(null);

  const createTransform = (...steps: string[]) => {
    const sequences = [steps.shift()];
    steps.forEach((step, i) => sequences.push(`${sequences[i]} ${step}`));
    return sequences;
  };

  const createAnimation = (name: string, rotation: number) => {
    if (!stylesheetRef.current) return;

    const [s1, s2, s3] = createTransform(
      `translate(-50%, -50%) rotate(${rotation}deg) translate(10px, 0px)`,
      `translate(${distance}px, 0px) scale(0.5, 0.5)`,
      `translate(${width / 2}px, 0) scale(0, 0)`,
    );

    const keyframes = `
      @keyframes ${name} {
        0% {
          transform: ${s1};
        }
        70% {
          transform: ${s2};
        }
        100% {
          transform: ${s3};
        }
      }`;

    if (stylesheetRef.current.sheet) {
      stylesheetRef.current.sheet.insertRule(
        keyframes,
        stylesheetRef.current.sheet.cssRules.length,
      );
    }
  };

  const makeSpark = (center: { x: number; y: number }, rotation: number) => {
    const animationName = `spark_${rotation}`;
    createAnimation(animationName, rotation);

    const div = document.createElement('div');
    div.classList.add('spark');
    div.style.top = `${center.y}px`;
    div.style.left = `${center.x}px`;
    div.style.animation = `${animationName} 400ms ease-out both`;
    div.setAttribute('aria-hidden', 'true');
    document.body.appendChild(div);

    setTimeout(() => div.remove(), 400);
  };

  useEffect(() => {
    const styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);
    stylesheetRef.current = styleSheet;

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (center: { x: number; y: number }) => {
    for (let i = 1; i < total; i++) {
      makeSpark(center, -45 * i);
    }
  };
};
