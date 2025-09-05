
"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface ScribbleCraftCanvasProps {
  text: string;
  fontFamily: string;
  paperType: string;
}

const ScribbleCraftCanvas = forwardRef<{ downloadImage: () => void }, ScribbleCraftCanvasProps>(
  ({ text, fontFamily, paperType }, ref) => {
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
        const canvasHeight = Math.max(500, width * 1.414); 

        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        ctx.scale(dpr, dpr);

        // Paper styles
        switch (paperType) {
          case 'notebook-paper':
            drawNotebookPaper(ctx, canvasWidth, canvasHeight);
            break;
          case 'diary-page':
            drawDiaryPage(ctx, canvasWidth, canvasHeight);
            break;
          case 'old-paper':
            drawOldPaper(ctx, canvasWidth, canvasHeight);
            break;
          default: // white-paper
            drawWhitePaper(ctx, canvasWidth, canvasHeight);
            break;
        }


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
      
      const drawWhitePaper = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = "#fdfdfc";
        ctx.fillRect(0, 0, width, height);
        
        const grd = ctx.createLinearGradient(0, 0, 0, height);
        grd.addColorStop(0, "rgba(0,0,0,0.05)");
        grd.addColorStop(0.5, "rgba(0,0,0,0)");
        grd.addColorStop(1, "rgba(0,0,0,0.05)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);
      }

      const drawNotebookPaper = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height);

        // Blue lines
        ctx.strokeStyle = "rgba(173, 216, 230, 0.5)";
        ctx.lineWidth = 1;
        for (let y = PADDING; y < height; y += LINE_HEIGHT) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Red line
        ctx.strokeStyle = "rgba(255, 182, 193, 0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(PADDING * 1.5, 0);
        ctx.lineTo(PADDING * 1.5, height);
        ctx.stroke();
      }
      
      const drawDiaryPage = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = "#f3f0e8";
        ctx.fillRect(0, 0, width, height);

        // Add some texture
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const alpha = Math.random() * 0.05;
            ctx.fillStyle = `rgba(0,0,0,${alpha})`;
            ctx.fillRect(x, y, 2, 2);
        }
        // Decorative border
        ctx.strokeStyle = "#e0d8c6";
        ctx.lineWidth = 15;
        ctx.strokeRect(7.5, 7.5, width - 15, height - 15);
      }
      
      const drawOldPaper = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = "#f5e8c8";
        ctx.fillRect(0, 0, width, height);

        // Stains
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 50 + 20;
            const grd = ctx.createRadialGradient(x, y, 0, x, y, radius);
            grd.addColorStop(0, "rgba(165, 42, 42, 0.05)");
            grd.addColorStop(1, "rgba(165, 42, 42, 0)");
            ctx.fillStyle = grd;
            ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        }
      }

      const resizeObserver = new ResizeObserver(draw);
      resizeObserver.observe(container);

      // Initial draw
      draw();

      return () => resizeObserver.unobserve(container);
    }, [text, fontFamily, paperType]);

    return (
      <div ref={containerRef} className="w-full h-full min-h-[500px] bg-white rounded-md overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
    );
  }
);

ScribbleCraftCanvas.displayName = "ScribbleCraftCanvas";

export default ScribbleCraftCanvas;
