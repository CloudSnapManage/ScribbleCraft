
"use client";
import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3 } from 'lucide-react';

interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const ToolbarButton = ({ icon: Icon, onClick, active = false }: { icon: React.ElementType, onClick: () => void, active?: boolean }) => (
    <button
        onClick={onClick}
        onMouseDown={e => e.preventDefault()}
        className={`p-2 rounded-md hover:bg-gray-200 ${active ? 'bg-gray-300' : ''}`}
    >
        <Icon className="h-5 w-5" />
    </button>
);


const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        handleInput();
        editorRef.current?.focus();
    };

    const queryCommandState = (command: string) => {
        if (typeof window !== 'undefined') {
            return document.queryCommandState(command);
        }
        return false;
    }

    // Set initial content
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);
    
    return (
        <div className="border rounded-lg">
            <div className="toolbar flex items-center gap-1 p-2 border-b">
                <ToolbarButton icon={Heading1} onClick={() => execCommand('formatBlock', '<h1>')} active={queryCommandState('formatBlock')} />
                <ToolbarButton icon={Heading2} onClick={() => execCommand('formatBlock', '<h2>')} active={queryCommandState('formatBlock')} />
                <ToolbarButton icon={Heading3} onClick={() => execCommand('formatBlock', '<h3>')} active={queryCommandState('formatBlock')} />
                <ToolbarButton icon={Bold} onClick={() => execCommand('bold')} active={queryCommandState('bold')} />
                <ToolbarButton icon={Italic} onClick={() => execCommand('italic')} active={queryCommandState('italic')} />
                <ToolbarButton icon={Underline} onClick={() => execCommand('underline')} active={queryCommandState('underline')} />
                <ToolbarButton icon={List} onClick={() => execCommand('insertUnorderedList')} active={queryCommandState('insertUnorderedList')} />
                <ToolbarButton icon={ListOrdered} onClick={() => execCommand('insertOrderedList')} active={queryCommandState('insertOrderedList')} />
            </div>
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="p-4 min-h-[250px] outline-none focus:ring-0"
                dangerouslySetInnerHTML={{ __html: value }}
            />
        </div>
    );
};

export default TextEditor;
