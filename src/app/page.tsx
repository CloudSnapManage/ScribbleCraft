
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, Download } from "lucide-react";

import ScribbleCraftCanvas from "@/components/ScribbleCraftCanvas";

type CanvasHandle = {
  downloadImage: () => void;
};

const INITIAL_TEXT = `This is a sample text to showcase the handwriting generation.
You can type your own text in the editor above.
Enjoy creating beautiful handwritten notes!`;

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


export default function Home() {
  const [text, setText] = useState(INITIAL_TEXT);
  const [fontFamily, setFontFamily] = useState(fontOptions[0].value);
  const canvasRef = useRef<CanvasHandle>(null);

  const handleDownload = () => {
    canvasRef.current?.downloadImage();
  };

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">
      <main className="container mx-auto px-4 py-8 flex-grow w-full max-w-4xl">
        <Tabs defaultValue="text-editor">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="text-area">Text Area</TabsTrigger>
              <TabsTrigger value="text-editor">Text Editor</TabsTrigger>
            </TabsList>
            <Button variant="outline">Reset All</Button>
          </div>

          <TabsContent value="text-area">
            <Card>
              <CardContent className="p-4">
                <p>Text Area Content</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="text-editor">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="border-b pb-2 mb-4">
                    {/* Placeholder for a rich text editor toolbar */}
                    <div className="flex items-center space-x-2 text-gray-400 h-8">
                      <p>Toolbar placeholder</p>
                    </div>
                  </div>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start typing..."
                    className="min-h-[150px] text-base resize-y border-0 focus-visible:ring-0 px-0"
                    aria-label="Text input for handwriting generation"
                  />
                </CardContent>
              </Card>

              <div className="bg-blue-100 border border-blue-200 text-blue-800 text-sm rounded-md p-3 flex items-start">
                <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>"Text Editor" is in <b>beta mode</b> and it is under development. It does not support multipage yet. Also, the text may be cut off in some cases.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <Select defaultValue="16">
                  <SelectTrigger>
                    <SelectValue placeholder="Font Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16">16</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Ink Color" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="light-black">Light Black</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Paper Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white-paper-1">White Paper 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md">
                 <ScribbleCraftCanvas ref={canvasRef} text={text} fontFamily={fontFamily} />
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <div className="w-1/3">
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue placeholder="Text Resolution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleDownload} size="lg">
                  <Download className="mr-2"/>
                  Export Handwriting
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
