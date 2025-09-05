"use client";

import { useState, useRef, type RefObject } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Download, Eraser } from "lucide-react";
import ScribbleCraftCanvas from "@/components/ScribbleCraftCanvas";

type CanvasHandle = {
  downloadImage: () => void;
};

const INITIAL_TEXT = `Welcome to ScribbleCraft!

Just start typing in this box, and your words will magically appear as handwriting on the canvas to the right.

- Create lists
- Write paragraphs
- Express your thoughts

When you're happy with your creation, just hit the download button!`;

export default function Home() {
  const [text, setText] = useState(INITIAL_TEXT);
  const canvasRef = useRef<CanvasHandle>(null);

  const handleDownload = () => {
    canvasRef.current?.downloadImage();
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      <header className="py-6 md:py-8 text-center border-b">
        <h1 className="text-5xl md:text-6xl font-headline text-[hsl(var(--accent))]">
          ScribbleCraft
        </h1>
        <p className="mt-2 text-md md:text-lg text-muted-foreground">
          Turn your typed text into beautiful handwriting.
        </p>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
            <Card className="shadow-sm border-border/60 transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>Your Text</CardTitle>
                <CardDescription>
                  Type or paste your content below. It will update live.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Start typing..."
                  className="min-h-[300px] lg:min-h-[450px] text-base resize-y "
                  aria-label="Text input for handwriting generation"
                />
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button onClick={handleClear} variant="outline">
                    <Eraser className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                  <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download as PNG
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 lg:sticky lg:top-8">
            <Card className="shadow-sm border-border/60 transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>Your Masterpiece</CardTitle>
                <CardDescription>
                  A preview of your handwritten note.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScribbleCraftCanvas ref={canvasRef} text={text} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        <p>
          &copy; {new Date().getFullYear()} ScribbleCraft. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
