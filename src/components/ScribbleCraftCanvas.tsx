
"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import jsPDF from "jspdf";
import { useTheme } from "next-themes";

interface ScribbleCraftCanvasProps {
  text: string;
  fontFamily: string;
  paperType: string;
  fontSize: number;
  inkColor: string;
}

const ScribbleCraftCanvas = forwardRef<{ downloadImage: (pages: string[]) => void; downloadPdf: (pages: string[]) => void }, ScribbleCraftCanvasProps>(
  ({ text, fontFamily, paperType, fontSize, inkColor }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();
    
    const PADDING = 20;

    const drawPage = async (ctx: CanvasRenderingContext2D, pageText: string, width: number, height: number): Promise<void> => {
        return new Promise((resolve) => {
            switch (paperType) {
              case 'notebook-paper': drawNotebookPaper(ctx, width, height); break;
              case 'diary-page': drawDiaryPage(ctx, width, height); break;
              case 'old-paper': drawOldPaper(ctx, width, height); break;
              case 'graph-paper': drawGraphPaper(ctx, width, height); break;
              case 'blueprint': drawBlueprint(ctx, width, height); break;
              case 'blackboard': drawBlackboard(ctx, width, height); break;
              case 'corkboard': drawCorkboard(ctx, width, height); break;
              case 'parchment': drawParchment(ctx, width, height); break;
              case 'legal-pad': drawLegalPad(ctx, width, height); break;
              case 'dotted-grid': drawDottedGrid(ctx, width, height); break;
              case 'stone-tablet': drawStoneTablet(ctx, width, height); break;
              case 'papyrus': drawPapyrus(ctx, width, height); break;
              case 'linen-paper': drawLinenPaper(ctx, width, height); break;
              case 'watercolor-paper': drawWatercolorPaper(ctx, width, height); break;
              default: drawWhitePaper(ctx, width, height); break;
            }

            if (resolvedTheme === 'dark' && paperType === 'white-paper') {
              ctx.fillStyle = '#111827';
              ctx.fillRect(0, 0, width, height);
            }

            let effectiveInkColor = inkColor;
            if (resolvedTheme === 'dark' && paperType === 'white-paper') {
              effectiveInkColor = '#FFFFFF';
            } else if (paperType === 'blackboard' || paperType === 'blueprint') {
              effectiveInkColor = '#FFFFFF';
            }
            ctx.fillStyle = effectiveInkColor;
            
            ctx.textBaseline = "top";
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(pageText, 'text/html');

            let y = PADDING;
            let x = PADDING;
            const maxWidth = width - PADDING * 2;

            const renderNode = (node: ChildNode, parentStyles: string[]) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent || '';
                    if (!text.trim()) return;

                    let currentFontSize = fontSize;
                    if (parentStyles.includes('h1')) currentFontSize *= 1.8;
                    else if (parentStyles.includes('h2')) currentFontSize *= 1.5;
                    else if (parentStyles.includes('h3')) currentFontSize *= 1.2;

                    const lineHeight = currentFontSize * 1.5;
                    
                    let fontStyle = '';
                    if (parentStyles.includes('i') || parentStyles.includes('em')) fontStyle += 'italic ';
                    if (parentStyles.includes('b') || parentStyles.includes('strong')) fontStyle += 'bold ';
                    ctx.font = `${fontStyle}${currentFontSize}px ${fontFamily}`;

                    const words = text.split(' ');
                    for(const word of words) {
                        const testLine = x === PADDING ? word : ' ' + word;
                        const metrics = ctx.measureText(testLine);
                        
                        if (x + metrics.width > PADDING + maxWidth && x > PADDING) {
                            x = PADDING;
                            y += lineHeight;
                        }
                        
                        const wordMetrics = ctx.measureText(word);
                        ctx.fillText(word, x, y);

                        if(parentStyles.includes('u')) {
                            ctx.beginPath();
                            ctx.moveTo(x, y + currentFontSize + 2);
                            ctx.lineTo(x + wordMetrics.width, y + currentFontSize + 2);
                            ctx.strokeStyle = ctx.fillStyle;
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                        
                        x += wordMetrics.width;
                        x += ctx.measureText(' ').width;
                    }

                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;
                    const tagName = element.tagName.toLowerCase();
                    const styles = [...parentStyles, tagName];
                    
                    let isBlock = ['p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'].includes(tagName);
                    
                    if (isBlock && x > PADDING) {
                        x = PADDING;
                        let currentFontSize = fontSize;
                        if (parentStyles.includes('h1')) currentFontSize *= 1.8;
                        else if (parentStyles.includes('h2')) currentFontSize *= 1.5;
                        else if (parentStyles.includes('h3')) currentFontSize *= 1.2;
                        y += currentFontSize * 1.5;
                    }
                    
                    if(tagName === 'ul' || tagName === 'ol') {
                        Array.from(element.childNodes).forEach((child, index) => {
                             if(child.nodeName.toLowerCase() === 'li') {
                                 x = PADDING;
                                 let currentFontSize = fontSize;
                                 const lineHeight = currentFontSize * 1.5;
                                 ctx.font = `${currentFontSize}px ${fontFamily}`;
                                 
                                 const prefix = tagName === 'ul' ? '• ' : `${index + 1}. `;
                                 ctx.fillText(prefix, x, y);
                                 x += ctx.measureText(prefix).width;

                                 Array.from(child.childNodes).forEach(liChild => renderNode(liChild, styles));
                                 x = PADDING;
                                 y += lineHeight;
                             }
                        });
                    } else {
                        Array.from(element.childNodes).forEach(child => renderNode(child, styles));
                    }

                    if (isBlock) {
                        x = PADDING;
                        let currentFontSize = fontSize;
                         if (styles.includes('h1')) currentFontSize *= 1.8;
                         else if (styles.includes('h2')) currentFontSize *= 1.5;
                         else if (styles.includes('h3')) currentFontSize *= 1.2;
                        y += (currentFontSize * 1.5) * 0.5;
                    }
                }
            };
            Array.from(doc.body.childNodes).forEach(node => renderNode(node, []));
            resolve();
        });
    };

    const calculateTextHeight = (pageText: string, width: number): Promise<number> => {
      return new Promise((resolve) => {
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext("2d");
        if (!ctx) {
          resolve(0);
          return;
        }
        
        const canvasWidth = width;
        ctx.font = `${fontSize}px ${fontFamily}`;

        const parser = new DOMParser();
        const doc = parser.parseFromString(pageText, 'text/html');

        let y = PADDING;
        let x = PADDING;
        const maxWidth = canvasWidth - PADDING * 2;

        const renderNode = (node: ChildNode, parentStyles: string[]) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent || '';
                if (!text.trim()) return;

                let currentFontSize = fontSize;
                if (parentStyles.includes('h1')) currentFontSize *= 1.8;
                else if (parentStyles.includes('h2')) currentFontSize *= 1.5;
                else if (parentStyles.includes('h3')) currentFontSize *= 1.2;

                const lineHeight = currentFontSize * 1.5;
                
                let fontStyle = '';
                if (parentStyles.includes('i') || parentStyles.includes('em')) fontStyle += 'italic ';
                if (parentStyles.includes('b') || parentStyles.includes('strong')) fontStyle += 'bold ';
                ctx.font = `${fontStyle}${currentFontSize}px ${fontFamily}`;

                const words = text.split(' ');
                for(const word of words) {
                    const testLine = x === PADDING ? word : ' ' + word;
                    const metrics = ctx.measureText(testLine);
                    
                    if (x + metrics.width > PADDING + maxWidth && x > PADDING) {
                        x = PADDING;
                        y += lineHeight;
                    }
                    
                    x += ctx.measureText(word).width;
                    x += ctx.measureText(' ').width;
                }

            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement;
                const tagName = element.tagName.toLowerCase();
                const styles = [...parentStyles, tagName];
                
                let isBlock = ['p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'].includes(tagName);
                
                if (isBlock && x > PADDING) {
                    x = PADDING;
                    let currentFontSize = fontSize;
                    if (parentStyles.includes('h1')) currentFontSize *= 1.8;
                    else if (parentStyles.includes('h2')) currentFontSize *= 1.5;
                    else if (parentStyles.includes('h3')) currentFontSize *= 1.2;
                    y += currentFontSize * 1.5;
                }
                
                if(tagName === 'ul' || tagName === 'ol') {
                    Array.from(element.childNodes).forEach((child) => {
                         if(child.nodeName.toLowerCase() === 'li') {
                             x = PADDING;
                             let currentFontSize = fontSize;
                             const lineHeight = currentFontSize * 1.5;
                             ctx.font = `${currentFontSize}px ${fontFamily}`;
                             
                             const prefix = tagName === 'ul' ? '• ' : `1. `; // Use placeholder for index
                             x += ctx.measureText(prefix).width;

                             Array.from(child.childNodes).forEach(liChild => renderNode(liChild, styles));
                             x = PADDING;
                             y += lineHeight;
                         }
                    });
                } else {
                    Array.from(element.childNodes).forEach(child => renderNode(child, styles));
                }

                if (isBlock) {
                    x = PADDING;
                    let currentFontSize = fontSize;
                     if (styles.includes('h1')) currentFontSize *= 1.8;
                     else if (styles.includes('h2')) currentFontSize *= 1.5;
                     else if (styles.includes('h3')) currentFontSize *= 1.2;
                    y += (currentFontSize * 1.5) * 0.5;
                }
            }
        };

        // Use requestAnimationFrame to ensure fonts are loaded
        requestAnimationFrame(() => {
          Array.from(doc.body.childNodes).forEach(node => renderNode(node, []));
          resolve(y + fontSize * 1.5 + PADDING);
        });
      });
    };

    const getPageCanvases = async (pages: string[]) => {
        const container = containerRef.current;
        if (!container) return [];

        const { width } = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const canvasWidth = width;

        const pageCanvases = await Promise.all(
          pages.map(async (pageText) => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) return null;

            const calculatedHeight = await calculateTextHeight(pageText, canvasWidth);
            const canvasHeight = Math.max(container.clientHeight, calculatedHeight);

            tempCanvas.width = canvasWidth * dpr;
            tempCanvas.height = canvasHeight * dpr;
            tempCtx.scale(dpr, dpr);

            await drawPage(tempCtx, pageText, canvasWidth, canvasHeight);
            return tempCanvas;
          })
        );
        
        return pageCanvases.filter(c => c !== null) as HTMLCanvasElement[];
    }

    useImperativeHandle(ref, () => ({
      downloadImage: async (pages) => {
        const validCanvases = await getPageCanvases(pages);
        if (validCanvases.length === 0) return;

        const totalHeight = validCanvases.reduce((sum, canvas) => sum + canvas.height, 0);
        const canvasWidth = validCanvases[0].width;
        
        const stitchedCanvas = document.createElement('canvas');
        stitchedCanvas.width = canvasWidth;
        stitchedCanvas.height = totalHeight;
        const stitchedCtx = stitchedCanvas.getContext('2d');
        if (!stitchedCtx) return;

        let currentY = 0;
        for (const canvas of validCanvases) {
          stitchedCtx.drawImage(canvas, 0, currentY);
          currentY += canvas.height;
        }

        const link = document.createElement("a");
        link.download = "scribblecraft.png";
        link.href = stitchedCanvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      downloadPdf: async (pages) => {
        const validCanvases = await getPageCanvases(pages);
        if (validCanvases.length === 0) return;

        const dpr = window.devicePixelRatio || 1;
        const firstCanvas = validCanvases[0];
        const pdfWidth = firstCanvas.width / dpr;
        const pdfHeight = firstCanvas.height / dpr;
        
        const pdf = new jsPDF({
            orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
            unit: 'px',
            format: [pdfWidth, pdfHeight]
        });

        for (let i = 0; i < validCanvases.length; i++) {
            const canvas = validCanvases[i];
            const imgData = canvas.toDataURL('image/png');
            const canvasWidth = canvas.width / dpr;
            const canvasHeight = canvas.height / dpr;
            
            if (i > 0) {
                pdf.addPage([canvasWidth, canvasHeight], canvasWidth > canvasHeight ? 'landscape' : 'portrait');
            }
            pdf.addImage(imgData, 'PNG', 0, 0, canvasWidth, canvasHeight);
        }

        pdf.save('scribblecraft.pdf');
      }
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const draw = async () => {
        const { width } = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const canvasWidth = width;
        const calculatedHeight = await calculateTextHeight(text, canvasWidth);
        const canvasHeight = Math.max(container.clientHeight, calculatedHeight); 

        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        ctx.scale(dpr, dpr);
        
        await drawPage(ctx, text, canvasWidth, canvasHeight);
      };
      
      const resizeObserver = new ResizeObserver(() => draw());
      if (container) {
        resizeObserver.observe(container);
      }
      
      // A small delay to ensure fonts are loaded before first draw
      const drawTimeout = setTimeout(draw, 100);

      return () => {
        clearTimeout(drawTimeout);
        if(container) {
            resizeObserver.unobserve(container)
        }
      };
    }, [text, fontFamily, paperType, fontSize, inkColor, resolvedTheme]);
    
      
      const drawWhitePaper = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = resolvedTheme === 'dark' ? '#111827' : '#fdfdfc';
        ctx.fillRect(0, 0, width, height);
      }

      const drawNotebookPaper = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = resolvedTheme === 'dark' ? '#1f2937' : '#fff';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = resolvedTheme === 'dark' ? "rgba(107, 114, 128, 0.5)" :"rgba(173, 216, 230, 0.5)";
        ctx.lineWidth = 1;
        const lineHeight = fontSize * 1.5;
        for (let y = PADDING; y < height; y += lineHeight) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        ctx.strokeStyle = resolvedTheme === 'dark' ? "rgba(252, 165, 165, 0.8)" : "rgba(255, 182, 193, 0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(PADDING * 1.5, 0);
        ctx.lineTo(PADDING * 1.5, height);
        ctx.stroke();
      }
      
      const drawDiaryPage = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = resolvedTheme === 'dark' ? '#2c2a24' : "#f3f0e8";
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const alpha = Math.random() * 0.05;
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.fillRect(x, y, 2, 2);
        }
        ctx.strokeStyle = resolvedTheme === 'dark' ? '#444036' : "#e0d8c6";
        ctx.lineWidth = 15;
        ctx.strokeRect(7.5, 7.5, width - 15, height - 15);
      }
      
      const drawOldPaper = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = resolvedTheme === 'dark' ? '#3d372a' : "#f5e8c8";
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 50 + 20;
            const grd = ctx.createRadialGradient(x, y, 0, x, y, radius);
            grd.addColorStop(0, "rgba(255, 255, 255, 0.03)");
            grd.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = grd;
            ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        }
      }

      const drawGraphPaper = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = resolvedTheme === 'dark' ? '#111827' : '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = resolvedTheme === 'dark' ? "rgba(100, 150, 255, 0.2)" : "rgba(0, 100, 255, 0.2)";
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
        ctx.fillStyle = resolvedTheme === 'dark' ? '#5f4a33' : '#d2b48c';
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
        ctx.fillStyle = resolvedTheme === 'dark' ? '#4a463a' : "#f5eecf";
        ctx.fillRect(0, 0, width, height);
        const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
        gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      const drawLegalPad = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.fillStyle = resolvedTheme === 'dark' ? '#444428' : "#fffacd";
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = resolvedTheme === 'dark' ? "rgba(107, 114, 128, 0.7)" : "rgba(173, 216, 230, 0.7)";
        ctx.lineWidth = 1;
        const lineHeight = fontSize * 1.5;
        for (let y = PADDING; y < height; y += lineHeight) {
            ctx.beginPath();
            ctx.moveTo(PADDING * 2, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        ctx.strokeStyle = resolvedTheme === 'dark' ? '#b91c1c' : "#ff6347";
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
        ctx.fillStyle = resolvedTheme === 'dark' ? '#1f2937' : '#f9f9f9';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = resolvedTheme === 'dark' ? '#6b7280' : "#cccccc";
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
        ctx.fillStyle = resolvedTheme === 'dark' ? '#4a412a' : "#e6d8b5";
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
          ctx.fillStyle = resolvedTheme === 'dark' ? '#3c3631' : "#faf0e6";
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
          ctx.fillStyle = resolvedTheme === 'dark' ? '#3c3c38' : "#f8f8f0";
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
          gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);
      }


    return (
      <div ref={containerRef} className="w-full h-full min-h-[500px] overflow-hidden rounded-lg">
        <canvas ref={canvasRef} />
      </div>
    );
  }
);

ScribbleCraftCanvas.displayName = "ScribbleCraftCanvas";

export default ScribbleCraftCanvas;

    