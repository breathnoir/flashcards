import { useLayoutEffect, useRef, useState } from "react";

interface FitTextProps {
  text: string;
  max: number;
  min: number;
}

export default function FitText({ text, max, min }: FitTextProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState(max);

  useLayoutEffect(() => {
    const span = spanRef.current;
    if (!span) return;

    span.style.fontSize = `${max}px`;

    while (span.offsetHeight > span.parentElement!.clientHeight && size > min) {
      setSize((s) => s - 1);
      span.style.fontSize = `${size - 1}px`;
    }
  }, [text, max, min]);

  return (
    <span
      ref={spanRef}
      style={{ fontSize: `${size - 3}px`, lineHeight: 1.2 }}
      className="text-black text-center card-body-truncate"
    >
      {text}
    </span>
  );
}
