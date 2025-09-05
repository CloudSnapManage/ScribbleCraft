
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

const INITIAL_TEXT = `test test`;

export default function Home() {
  const [text, setText] = useState(INITIAL_TEXT);
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Font Family" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alima">Alima (as(if), Latin, Bengali)</SelectItem>
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
              
              <div className="text-center text-xs text-gray-500 my-4">
                <p>Ads by Google</p>
                <div className="flex justify-center items-center gap-2 mt-1">
                    <Button variant="link" className="p-0 h-auto text-blue-600">Send feedback</Button>
                    <span className="text-gray-400">|</span>
                    <Button variant="link" className="p-0 h-auto text-gray-500">Why this ad?</Button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md">
                 <ScribbleCraftCanvas ref={canvasRef} text={text} />
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
