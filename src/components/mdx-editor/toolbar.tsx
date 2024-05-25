'use client';

import { FC } from 'react';
import {
  UndoRedo,
  Separator,
  CreateLink,
  CodeToggle,
  InsertTable,
  ListsToggle,
  InsertImage,
  BlockTypeSelect,
  InsertCodeBlock,
  ShowSandpackInfo,
  ConditionalContents,
  InsertThematicBreak,
  DiffSourceToggleWrapper,
  ChangeCodeMirrorLanguage,
  BoldItalicUnderlineToggles,
  StrikeThroughSupSubToggles
} from '@mdxeditor/editor';

export const Toolbar: FC = () => {
  return (
    <DiffSourceToggleWrapper>
      <ConditionalContents
        options={[
          {
            when: (editor) => editor?.editorType === 'codeblock',
            contents: () => <ChangeCodeMirrorLanguage />
          },
          {
            when: (editor) => editor?.editorType === 'sandpack',
            contents: () => <ShowSandpackInfo />
          },
          {
            fallback: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />
                <StrikeThroughSupSubToggles />
                <Separator />
                <ListsToggle />
                <Separator />

                <BlockTypeSelect />

                <Separator />

                <CreateLink />
                <InsertImage />

                <Separator />

                <InsertTable />
                <InsertThematicBreak />

                <Separator />
                <InsertCodeBlock />

                <Separator />
              </>
            )
          }
        ]}
      />
    </DiffSourceToggleWrapper>
  );
};
