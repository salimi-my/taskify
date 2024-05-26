'use client';

import { FC } from 'react';
import { toast } from 'sonner';
import { formatFileSize } from '@edgestore/react/utils';
import { EdgeStoreApiClientError } from '@edgestore/react/shared';
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

import { useEdgeStore } from '@/lib/edgestore';
import { Toolbar } from '@/components/mdx-editor/toolbar';

import '@mdxeditor/editor/style.css';

interface EditorProps {
  markdown: string | undefined;
  setMarkdown: (markdown: string) => void;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

const Editor: FC<EditorProps> = ({ markdown, setMarkdown, editorRef }) => {
  const { edgestore } = useEdgeStore();

  const onUpload = () => {
    // disable inputs
    document
      .querySelectorAll('.mdxeditor-popup-container > div > form > div > input')
      ?.forEach((input) => input.setAttribute('disabled', 'disabled'));

    // disable submit button
    document
      .querySelector(
        '.mdxeditor-popup-container > div > form > div > button[type="submit"]'
      )
      ?.setAttribute('disabled', 'disabled');

    // disable reset button
    document
      .querySelector(
        '.mdxeditor-popup-container > div > form > div > button[type="reset"]'
      )
      ?.setAttribute('disabled', 'disabled');
  };

  return (
    <MDXEditor
      onChange={setMarkdown}
      placeholder='Add your task description here...'
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
        imagePlugin({
          imageUploadHandler: async (image: File) => {
            if (image) {
              onUpload();
              toast.loading('Uploading image...');

              try {
                const res = await edgestore.publicImages.upload({
                  file: image
                });

                toast.dismiss();
                toast.success('Image uploaded!');

                return res.url;
              } catch (error) {
                toast.dismiss();

                if (error instanceof EdgeStoreApiClientError) {
                  if (error.data.code === 'FILE_TOO_LARGE') {
                    toast.error(
                      `File too large. Max size is ${formatFileSize(
                        error.data.details.maxFileSize
                      )}`
                    );
                  }

                  if (error.data.code === 'MIME_TYPE_NOT_ALLOWED') {
                    toast.error(
                      `File type not allowed. Allowed types are ${error.data.details.allowedMimeTypes.join(
                        ', '
                      )}`
                    );
                  }
                } else {
                  toast.error('Uh oh! Something went wrong.');
                }
              }
            }
            return '';
          }
        }),
        tablePlugin(),
        thematicBreakPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
        sandpackPlugin(),
        codeMirrorPlugin({
          codeBlockLanguages: {
            php: 'PHP',
            js: 'JavaScript',
            tsx: 'TypeScript',
            css: 'CSS',
            html: 'HTML',
            txt: 'text'
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
