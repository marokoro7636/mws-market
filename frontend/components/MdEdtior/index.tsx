'use client'

import {
    AdmonitionDirectiveDescriptor,
    MDXEditor,
    MDXEditorMethods,
    UndoRedo,
    codeBlockPlugin,
    codeMirrorPlugin,
    diffSourcePlugin,
    directivesPlugin,
    frontmatterPlugin,
    headingsPlugin,
    imagePlugin,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    markdownShortcutPlugin,
    quotePlugin,
    sandpackPlugin,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
    Separator,
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    CreateLink,
    DiffSourceToggleWrapper,
    InsertImage,
    ListsToggle
} from "@mdxeditor/editor"

import { FC } from 'react'

interface EditorProps {
    markdown: string
    // onChange: (markdown: string) => void
    editorRef?: React.MutableRefObject<MDXEditorMethods | null>
}

const Editor: FC<EditorProps> = ({ markdown, editorRef }) => {
    return <MDXEditor
        ref={editorRef}
        markdown={markdown}
        plugins={[
            toolbarPlugin({
                toolbarContents: () => (
                    <>
                        <DiffSourceToggleWrapper>
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                            <ListsToggle />
                            <Separator />
                            <BlockTypeSelect />
                            <CreateLink />
                            <InsertImage />
                            <Separator />
                        </DiffSourceToggleWrapper>
                    </>
                )
            }),
            listsPlugin(),
            quotePlugin(),
            headingsPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            imagePlugin(),
            tablePlugin(),
            thematicBreakPlugin(),
            frontmatterPlugin(),
            // codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
            // sandpackPlugin({ sandpackConfig: virtuosoSampleSandpackConfig }),
            // codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text' } }),
            diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
            markdownShortcutPlugin()
        ]}
    />
}

export default Editor