'use client';

import { FC } from 'react';
import {
  MDXEditor,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  imagePlugin,
  tablePlugin,
  toolbarPlugin,
  headingsPlugin,
  sandpackPlugin,
  codeBlockPlugin,
  MDXEditorMethods,
  diffSourcePlugin,
  linkDialogPlugin,
  codeMirrorPlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin
} from '@mdxeditor/editor';

import { Toolbar } from '@/components/mdx-editor/toolbar';

import '@mdxeditor/editor/style.css';

interface EditorProps {
  markdown: string | undefined;
  setMarkdown: (markdown: string) => void;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

const Editor: FC<EditorProps> = ({ markdown, setMarkdown, editorRef }) => {
  return (
    <MDXEditor
      onChange={setMarkdown}
      ref={editorRef}
      markdown={markdown || ''}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => <Toolbar />
        }),
        listsPlugin(),
        quotePlugin(),
        headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin(),
        tablePlugin(),
        thematicBreakPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
        sandpackPlugin(),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: 'JavaScript',
            css: 'CSS',
            txt: 'text',
            tsx: 'TypeScript'
          }
        }),
        diffSourcePlugin({
          viewMode: 'rich-text',
          diffMarkdown: markdown,
          readOnlyDiff: true
        }),
        markdownShortcutPlugin()
      ]}
    />
  );
};

export default Editor;
