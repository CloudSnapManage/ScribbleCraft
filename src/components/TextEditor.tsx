
"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const ToolbarButton = ({ icon: Icon, onClick, active = false }: { icon: React.ElementType, onClick: () => void, active?: boolean }) => (
    <button
        onClick={onClick}
        onMouseDown={e => e.preventDefault()}
        className={`p-2 rounded-md hover:bg-accent ${active ? 'bg-muted' : ''}`}
    >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
);


const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [activeButtons, setActiveButtons] = useState<{[key: string]: boolean}>({});

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
            updateActiveButtons();
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

    const updateActiveButtons = () => {
        setActiveButtons({
            h1: document.queryCommandValue('formatBlock') === 'h1',
            h2: document.queryCommandValue('formatBlock') === 'h2',
            h3: document.queryCommandValue('formatBlock') === 'h3',
            bold: queryCommandState('bold'),
            italic: queryCommandState('italic'),
            underline: queryCommandState('underline'),
            insertUnorderedList: queryCommandState('insertUnorderedList'),
            insertOrderedList: queryCommandState('insertOrderedList'),
        });
    }

    // Set initial content
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    useEffect(() => {
        const editor = editorRef.current;
        const handleSelectionChange = () => {
            if (document.activeElement === editor) {
                updateActiveButtons();
            }
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        editor?.addEventListener('focus', updateActiveButtons);
        editor?.addEventListener('click', updateActiveButtons);
        editor?.addEventListener('keyup', updateActiveButtons);


        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
            editor?.removeEventListener('focus', updateActiveButtons);
            editor?.removeEventListener('click', updateActiveButtons);
            editor?.removeEventListener('keyup', updateActiveButtons);
        };
    }, []);
    
    return (
        <div className="border rounded-lg bg-card">
            <div className="toolbar flex items-center gap-1 p-1 sm:p-2 border-b flex-wrap">
                <ToolbarButton icon={Heading1} onClick={() => execCommand('formatBlock', '<h1>')} active={activeButtons['h1']} />
                <ToolbarButton icon={Heading2} onClick={() => execCommand('formatBlock', '<h2>')} active={activeButtons['h2']} />
                <ToolbarButton icon={Heading3} onClick={() => execCommand('formatBlock', '<h3>')} active={activeButtons['h3']} />
                <ToolbarButton icon={Bold} onClick={() => execCommand('bold')} active={activeButtons['bold']} />
                <ToolbarButton icon={Italic} onClick={() => execCommand('italic')} active={activeButtons['italic']} />
                <ToolbarButton icon={Underline} onClick={() => execCommand('underline')} active={activeButtons['underline']} />
                <ToolbarButton icon={List} onClick={() => execCommand('insertUnorderedList')} active={activeButtons['insertUnorderedList']} />
                <ToolbarButton icon={ListOrdered} onClick={() => execCommand('insertOrderedList')} active={activeButtons['insertOrderedList']} />
            </div>
            <ScrollArea className="h-[250px]">
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    className="p-4 w-full h-full outline-none focus:ring-0"
                    style={{minHeight: '250px'}}
                />
            </ScrollArea>
        </div>
    );
};

export default TextEditor;

    