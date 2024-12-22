"use client";

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell'; 
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { createLowlight } from 'lowlight';

// TipTap styles
// import '@tiptap/d/';

const TextEditor = () => {
  // Initialize lowlight
  const lowlight = createLowlight();

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount,
      CodeBlockLowlight.configure({
        lowlight, // Provide the lowlight instance here
      }),
      BulletList,
      OrderedList,
      TaskList,
      TaskItem,
      Link.configure({
        openOnClick: true,
      }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell, 
      Paragraph,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      FontFamily.configure({
        types: ['serif', 'sans-serif', 'monospace'],
      }),
      Color.configure({
        types: ['color', 'backgroundColor'],
      }),
      Highlight,
      TextStyle,
      Underline,
      TextAlign.configure({
        types: ['left', 'center', 'right', 'justify'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing here...',
      }),
    ],
    content: '<p>Your amazing content starts here...</p>',
  });

  if (!editor) {
    return <div>Loading...</div>; // Or any fallback UI
  }

  return (
    <div>
      <h2 className="mb-4">Rich Text Editor</h2>
      <EditorContent editor={editor} className="ProseMirror" style={{ minHeight: '300px', border: '1px solid #ccc' }} />
    </div>
  );
};

export default TextEditor;
