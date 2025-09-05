"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface ScribbleCraftCanvasProps {
  text: string;
}

const ScribbleCraftCanvas = forwardRef<{ downloadImage: () => void }, ScribbleCraftCanvasProps>(
  ({ text }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const FONT_SIZE = 42;
    const LINE_HEIGHT = FONT_SIZE * 1.5;
    const FONT_FAMILY = "'Shadows Into Light', cursive";
    const PADDING = 40;

    useImperativeHandle(ref, () => ({
      downloadImage: () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const link = document.createElement("a");
          link.download = "scribblecraft.png";
          link.href = canvas.toDataURL("image/png");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const draw = () => {
        const { width } = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const canvasWidth = width;
        const canvasHeight = width * 1.414; // A4-ish aspect ratio

        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        ctx.scale(dpr, dpr);

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = "#1a1a1a";
        ctx.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
        ctx.textBaseline = "top";

        const linesFromInput = text.split('\n');
        let y = PADDING;

        for (const inputLine of linesFromInput) {
            if (inputLine === '') {
                y += LINE_HEIGHT;
                continue;
            }
            
            const words = inputLine.split(' ');
            let currentLine = '';
            const x = PADDING;
            const maxWidth = canvasWidth - (PADDING * 2);

            for (let i = 0; i < words.length; i++) {
                const testWord = words[i];
                const testLine = currentLine.length > 0 ? currentLine + ' ' + testWord : testWord;
                const metrics = ctx.measureText(testLine);

                if (metrics.width > maxWidth && i > 0) {
                    ctx.fillText(currentLine, x, y);
                    currentLine = testWord;
                    y += LINE_HEIGHT;
                } else {
                    currentLine = testLine;
                }
            }
            ctx.fillText(currentLine, x, y);
            y += LINE_HEIGHT;
        }
      };

      const resizeObserver = new ResizeObserver(draw);
      resizeObserver.observe(container);

      // Initial draw
      draw();

      return () => resizeObserver.unobserve(container);
    }, [text]);

    return (
      <div ref={containerRef} className="w-full h-full aspect-[1/1.414] bg-white rounded-md overflow-hidden border shadow-inner">
        <canvas ref={canvasRef} />
      </div>
    );
  }
);

ScribbleCraftCanvas.displayName = "ScribbleCraftCanvas";

export default ScribbleCraftCanvas;
