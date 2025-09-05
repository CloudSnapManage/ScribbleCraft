
"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface ScribbleCraftCanvasProps {
  text: string;
  fontFamily: string;
  paperType: string;
  fontSize: number;
}

const ScribbleCraftCanvas = forwardRef<{ downloadImage: () => void }, ScribbleCraftCanvasProps>(
  ({ text, fontFamily, paperType, fontSize }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
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
      
      const FONT_SIZE = fontSize;
      const LINE_HEIGHT = FONT_SIZE * 1.5;

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
          case 'graph-paper':
            drawGraphPaper(ctx, canvasWidth, canvasHeight);
            break;
          case 'blueprint':
            drawBlueprint(ctx, canvasWidth, canvasHeight);
            break;
          case 'blackboard':
            drawBlackboard(ctx, canvasWidth, canvasHeight);
            break;
          case 'corkboard':
            drawCorkboard(ctx, canvasWidth, canvasHeight);
            break;
          case 'parchment':
            drawParchment(ctx, canvasWidth, canvasHeight);
            break;
          case 'legal-pad':
            drawLegalPad(ctx, canvasWidth, canvasHeight);
            break;
          case 'dotted-grid':
            drawDottedGrid(ctx, canvasWidth, canvasHeight);
            break;
          case 'stone-tablet':
            drawStoneTablet(ctx, canvasWidth, canvasHeight);
            break;
          case 'papyrus':
            drawPapyrus(ctx, canvasWidth, canvasHeight);
            break;
          case 'linen-paper':
            drawLinenPaper(ctx, canvasWidth, canvasHeight);
            break;
          case 'watercolor-paper':
            drawWatercolorPaper(ctx, canvasWidth, canvasHeight);
            break;
          default: // white-paper
            drawWhitePaper(ctx, canvasWidth, canvasHeight);
            break;
        }


        ctx.fillStyle = paperType === 'blackboard' || paperType === 'blueprint' ? '#FFFFFF' : '#1a1a1a';
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

      const drawGraphPaper = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = "rgba(0, 100, 255, 0.2)";
        ctx.lineWidth = 0.5;
        const gridSize = 20;
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
      }

      const drawBlueprint = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = "#0a2e5d";
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 0.5;
        const gridSize = 30;
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
      }

      const drawBlackboard = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = "#343434";
        ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < 10000; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.02})`;
            ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
        }
      }

      const drawCorkboard = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = "#d2b48c";
        ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < 20000; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const shade = Math.random() * 0.2 - 0.1;
            ctx.fillStyle = `rgba(0, 0, 0, ${0.05 + shade})`;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
      }

      const drawParchment = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = "#f5eecf";
        ctx.fillRect(0, 0, width, height);
        const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
        gradient.addColorStop(0, "rgba(210, 180, 140, 0)");
        gradient.addColorStop(1, "rgba(210, 180, 140, 0.3)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      const drawLegalPad = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = "#fffacd";
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = "rgba(173, 216, 230, 0.7)";
        ctx.lineWidth = 1;
        for (let y = PADDING; y < height; y += LINE_HEIGHT) {
            ctx.beginPath();
            ctx.moveTo(PADDING * 2, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        ctx.strokeStyle = "#ff6347";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(PADDING, 0);
        ctx.lineTo(PADDING, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(PADDING + 4, 0);
        ctx.lineTo(PADDING + 4, height);
        ctx.stroke();
      }

      const drawDottedGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = "#f9f9f9";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#cccccc";
        const dotSize = 2;
        const gridSize = 25;
        for (let x = PADDING; x < width - PADDING; x += gridSize) {
            for (let y = PADDING; y < height - PADDING; y += gridSize) {
                ctx.beginPath();
                ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
      }

      const drawStoneTablet = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = "#a9a9a9";
        ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < 15000; i++) {
            ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.1})`;
            ctx.fillRect(Math.random() * width, Math.random() * height, Math.random() * 3, Math.random() * 3);
        }
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }
      
      const drawPapyrus = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = "#e6d8b5";
        ctx.fillRect(0, 0, width, height);
        ctx.lineWidth = 1;
        for(let i = 0; i < width; i+=4) {
          ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.05})`;
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, height);
          ctx.stroke();
        }
         for(let i = 0; i < height; i+=4) {
          ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.05})`;
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(width, i);
          ctx.stroke();
        }
      }

      const drawLinenPaper = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
          ctx.fillStyle = "#faf0e6";
          ctx.fillRect(0, 0, width, height);
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
          for (let i = 0; i < width; i += 3) {
              ctx.beginPath();
              ctx.moveTo(i, 0);
              ctx.lineTo(i, height);
              ctx.stroke();
          }
          for (let i = 0; i < height; i += 3) {
              ctx.beginPath();
              ctx.moveTo(0, i);
              ctx.lineTo(width, i);
              ctx.stroke();
          }
      }

      const drawWatercolorPaper = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
          ctx.fillStyle = "#f8f8f0";
          ctx.fillRect(0, 0, width, height);
          for (let i = 0; i < 30000; i++) {
              ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.02})`;
              const x = Math.random() * width;
              const y = Math.random() * height;
              const size = Math.random() * 2;
              ctx.fillRect(x, y, size, size);
          }
          const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
          gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
          gradient.addColorStop(1, "rgba(220, 220, 220, 0.1)");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);
      }

      const resizeObserver = new ResizeObserver(draw);
      resizeObserver.observe(container);

      // Initial draw
      draw();

      return () => resizeObserver.unobserve(container);
    }, [text, fontFamily, paperType, fontSize]);

    return (
      <div ref={containerRef} className="w-full h-full min-h-[500px] bg-white rounded-md overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
    );
  }
);

ScribbleCraftCanvas.displayName = "ScribbleCraftCanvas";

export default ScribbleCraftCanvas;
