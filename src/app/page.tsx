
"use client";

import { useState, useRef, type RefObject } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Download, Trash2, GraduationCap } from "lucide-react";

import ScribbleCraftCanvas from "@/components/ScribbleCraftCanvas";

type CanvasHandle = {
  downloadImage: () => void;
};

const INITIAL_TEXT = `When the Time is Right

I thought love was forever,
but maybe it is only a teacher.
Attraction, crushes, even longing—
all chapters,
not the book itself.
I see it now:
these feelings are seasons,
meant to pass,`;

const fontOptions = [
  { value: "'Shadows Into Light', cursive", label: "Shadows Into Light" },
  { value: "'Patrick Hand', cursive", label: "Patrick Hand" },
  { value: "'Caveat', cursive", label: "Caveat" },
  { value: "'Dancing Script', cursive", label: "Dancing Script" },
  { value: "'Kalam', cursive", label: "Kalam" },
  { value: "'Gaegu', cursive", label: "Gaegu" },
  { value: "'Gochi Hand', cursive", label: "Gochi Hand" },
  { value: "'Handlee', cursive", label: "Handlee" },
  { value: "'Indie Flower', cursive", label: "Indie Flower" },
  { value: "'Just Me Again Down Here', cursive", label: "Just Me Again Down Here" },
  { value: "'Marck Script', cursive", label: "Marck Script" },
  { value: "'Nanum Pen Script', cursive", label: "Nanum Pen Script" },
  { value: "'Nothing You Could Do', cursive", label: "Nothing You Could Do" },
  { value: "'Permanent Marker', cursive", label: "Permanent Marker" },
  { value: "'Rock Salt', cursive", label: "Rock Salt" },
  { value: "'Sue Ellen Francisco', cursive", label: "Sue Ellen Francisco" },
  { value: "'Waiting for the Sunrise', cursive", label: "Waiting for the Sunrise" },
  { value: "'Zeyada', cursive", label: "Zeyada" },
];

const paperOptions = [
    { value: "white-paper", label: "White Paper" },
    { value: "notebook-paper", label: "Notebook Paper" },
    { value: "diary-page", label: "Diary Page" },
    { value: "old-paper", label: "Old Paper" },
    { value: "graph-paper", label: "Graph Paper" },
    { value: "blueprint", label: "Blueprint" },
    { value: "blackboard", label: "Blackboard" },
    { value: "corkboard", label: "Corkboard" },
    { value: "parchment", label: "Parchment" },
    { value: "legal-pad", label: "Legal Pad" },
    { value: "dotted-grid", label: "Dotted Grid" },
    { value: "stone-tablet", label: "Stone Tablet" },
    { value: "papyrus", label: "Papyrus" },
    { value: "linen-paper", label: "Linen Paper" },
    { value: "watercolor-paper", label: "Watercolor Paper" },
]

export default function Home() {
  const [text, setText] = useState(INITIAL_TEXT);
  const [fontFamily, setFontFamily] = useState(fontOptions[0].value);
  const [paperType, setPaperType] = useState(paperOptions[0].value);
  const [fontSize, setFontSize] = useState(42);
  const canvasRef = useRef<CanvasHandle>(null);

  const handleDownload = () => {
    canvasRef.current?.downloadImage();
  };

  const handleReset = () => {
    setText(INITIAL_TEXT);
    setFontFamily(fontOptions[0].value);
    setPaperType(paperOptions[0].value);
    setFontSize(42);
  }

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{fontFamily: "'Shadows Into Light', cursive"}}>ScribbleCraft AI</h1>
          <p className="text-muted-foreground">Turn your typed text into beautiful handwriting.</p>
        </div>
        <Button variant="outline" onClick={handleReset}><Trash2 className="mr-2"/>Reset All</Button>
      </header>
      <main className="container mx-auto px-4 pb-8 flex-grow w-full max-w-7xl">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-4 relative">
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs flex items-center">
                  <GraduationCap className="h-4 w-4 mr-1"/>
                  MULTIPAGE SUPPORTED
                </div>
                <label htmlFor="text-area-input" className="text-sm font-medium text-gray-500">Text</label>
                <Textarea
                  id="text-area-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Start typing..."
                  className="min-h-[250px] text-base resize-y border-0 focus-visible:ring-0 px-0 mt-1"
                  aria-label="Text input for handwriting generation"
                />
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger>
                  <SelectValue placeholder="Font Family" />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map(font => (
                    <SelectItem key={font.value} value={font.value} style={{fontFamily: font.value}}>{font.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="font-size-input" className="text-sm font-medium text-gray-500">Font Size</label>
                  <Input
                    id="font-size-input"
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="mt-2"
                    min={8}
                    max={128}
                  />
                </div>
                <Select>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full mr-2" style={{backgroundColor: '#3a3a3a'}}></div>
                      <SelectValue placeholder="Ink Color" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light-black">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full mr-2" style={{backgroundColor: '#3a3a3a'}}></div>
                          Light Black
                        </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={paperType} onValueChange={setPaperType}>
                <SelectTrigger>
                  <SelectValue placeholder="Paper Type" />
                </SelectTrigger>
                <SelectContent>
                  {paperOptions.map(paper => (
                      <SelectItem key={paper.value} value={paper.value}>{paper.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
             <div className="flex justify-end items-center">
              <Button onClick={handleDownload} size="lg">
                <Download className="mr-2"/>
                Export Handwriting
              </Button>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-md h-full">
              <ScribbleCraftCanvas ref={canvasRef} text={text} fontFamily={fontFamily} paperType={paperType} fontSize={fontSize} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
