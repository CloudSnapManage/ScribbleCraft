"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface ScribbleCraftCanvasProps {
  text: string;
  fontFamily: string;
}

const ScribbleCraftCanvas = forwardRef<{ downloadImage: () => void }, ScribbleCraftCanvasProps>(
  ({ text, fontFamily }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const FONT_SIZE = 42;
    const LINE_HEIGHT = FONT_SIZE * 1.5;
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
        // Make the canvas taller
        const canvasHeight = Math.max(500, width * 1.414); 

        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        ctx.scale(dpr, dpr);

        // Draw a crumpled paper background
        ctx.fillStyle = "#fdfdfc";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        const grd = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        grd.addColorStop(0, "rgba(0,0,0,0.05)");
        grd.addColorStop(0.5, "rgba(0,0,0,0)");
        grd.addColorStop(1, "rgba(0,0,0,0.05)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);


        ctx.fillStyle = "#1a1a1a";
        ctx.font = `${FONT_SIZE}px ${fontFamily}`;
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
    }, [text, fontFamily]);

    return (
      <div ref={containerRef} className="w-full h-full min-h-[500px] bg-white rounded-md overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
    );
  }
);

ScribbleCraftCanvas.displayName = "ScribbleCraftCanvas";

export default ScribbleCraftCanvas;
