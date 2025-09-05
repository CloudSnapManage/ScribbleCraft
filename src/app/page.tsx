
"use client";

import { useState, useRef } from "react";
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
import { Download, Trash2, GraduationCap, Pilcrow, Type, Palette, Baseline, Bot } from "lucide-react";

import ScribbleCraftCanvas from "@/components/ScribbleCraftCanvas";
import TextEditor from "@/components/TextEditor";

type CanvasHandle = {
  downloadImage: () => void;
};

const INITIAL_TEXT = "<p>Start typing...</p>";

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

const fontSizeOptions = [
    { value: "16", label: "16px" },
    { value: "24", label: "24px" },
    { value: "32", label: "32px" },
    { value: "42", label: "42px" },
    { value: "56", label: "56px" },
    { value: "64", label: "64px" },
    { value: "72", label: "72px" },
]

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

const inkColorOptions = [
    { value: "#000000", label: "Black" },
    { value: "#3a3a3a", label: "Light Black" },
    { value: "#0000FF", label: "Blue" },
    { value: "#FF0000", label: "Red" },
    { value: "#008000", label: "Green" },
    { value: "#800080", label: "Purple" },
    { value: "#A52A2A", label: "Brown" },
    { value: "#FFA500", label: "Orange" },
    { value: "#FFC0CB", label: "Pink" },
    { value: "#FFFF00", label: "Yellow" },
]

export default function Home() {
  const [text, setText] = useState(INITIAL_TEXT);
  const [fontFamily, setFontFamily] = useState(fontOptions[0].value);
  const [paperType, setPaperType] = useState(paperOptions[0].value);
  const [fontSize, setFontSize] = useState(42);
  const [inkColor, setInkColor] = useState(inkColorOptions[0].value);
  const canvasRef = useRef<CanvasHandle>(null);

  const handleDownload = () => {
    canvasRef.current?.downloadImage();
  };

  const handleReset = () => {
    setText(INITIAL_TEXT);
    setFontFamily(fontOptions[0].value);
    setPaperType(paperOptions[0].value);
    setFontSize(42);
    setInkColor(inkColorOptions[0].value);
  }

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{fontFamily: "'Shadows Into Light', cursive"}}>ScribbleCraft AI</h1>
          <p className="text-muted-foreground">Turn your typed text into beautiful handwriting.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost"><Bot className="mr-2"/> AI suggestions</Button>
            <Button variant="outline" onClick={handleReset}><Trash2 className="mr-2"/>Reset All</Button>
        </div>

      </header>
      <main className="container mx-auto px-4 pb-8 flex-grow w-full max-w-7xl">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-0">
                <TextEditor value={text} onChange={setText} />
              </CardContent>
            </Card>
            
            <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2"><Pilcrow/> Manuscript options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger>
                             <div className="flex items-center gap-2">
                                <Type className="text-gray-500"/>
                                <SelectValue placeholder="Font Family" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                        {fontOptions.map(font => (
                            <SelectItem key={font.value} value={font.value} style={{fontFamily: font.value}}>{font.label}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>

                    <Select value={paperType} onValueChange={setPaperType}>
                        <SelectTrigger>
                            <div className="flex items-center gap-2">
                                <GraduationCap className="text-gray-500"/>
                                <SelectValue placeholder="Paper Type" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                        {paperOptions.map(paper => (
                            <SelectItem key={paper.value} value={paper.value}>{paper.label}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={String(fontSize)} onValueChange={(value) => setFontSize(Number(value))}>
                    <SelectTrigger>
                        <div className="flex items-center gap-2">
                            <Baseline className="text-gray-500"/>
                            <SelectValue placeholder="Font Size" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        {fontSizeOptions.map(size => (
                            <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={inkColor} onValueChange={setInkColor}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                        <Palette className="text-gray-500"/>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border" style={{backgroundColor: inkColor}}></div>
                            <span>{inkColorOptions.find(c => c.value === inkColor)?.label}</span>
                        </div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {inkColorOptions.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full border mr-2" style={{backgroundColor: color.value}}></div>
                              {color.label}
                            </div>
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
              <ScribbleCraftCanvas ref={canvasRef} text={text} fontFamily={fontFamily} paperType={paperType} fontSize={fontSize} inkColor={inkColor} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
