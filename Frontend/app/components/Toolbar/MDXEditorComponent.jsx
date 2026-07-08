"use client";
import { useState, useEffect } from "react";
import { $getSelection, $isRangeSelection } from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { 
  MDXEditor,
  toolbarPlugin,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
  frontmatterPlugin,
  diffSourcePlugin,
  quotePlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  StrikeThroughSupSubToggles,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  InsertAdmonition,
  InsertFrontmatter,
  Separator,
  DiffSourceToggleWrapper,
  useCellValues,
  activeEditor$
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

const HIGHLIGHT_COLOR = "#C19A6B"; // camel

// Custom Highlighter Toggle Button
function HighlightToggle() {
  const [activeEditor] = useCellValues(activeEditor$);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (!activeEditor) return;
    return activeEditor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        try {
          const selection = $getSelection();
          if ($isRangeSelection(selection) && !selection.isCollapsed()) {
            const node = selection.getNodes()[0];
            const style = (node && node.getStyle && node.getStyle()) || "";
            setIsHighlighted(style.includes(`background-color: ${HIGHLIGHT_COLOR}`));
          } else {
            setIsHighlighted(false);
          }
        } catch (err) {
          // fail silently, never break the rest of the toolbar
        }
      });
    });
  }, [activeEditor]);

  const toggleHighlight = () => {
    if (!activeEditor) return;
    activeEditor.update(() => {
      const selection = $getSelection();
      // Only apply when actual text is selected (not just a blinking cursor)
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        $patchStyleText(selection, {
          "background-color": isHighlighted ? null : HIGHLIGHT_COLOR,
        });
      }
    });
  };

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={toggleHighlight}
      title="Highlight text"
      className={isHighlighted ? "mdx-highlight-btn active" : "mdx-highlight-btn"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "28px",
        height: "28px",
        border: "none",
        borderRadius: "4px",
        background: isHighlighted ? HIGHLIGHT_COLOR : "transparent",
        cursor: "pointer",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 11-6 6v3h9l3-3" />
        <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4l8 8Z" />
      </svg>
    </button>
  );
}

export default function MDXEditorComponent({ 
  onChange, 
  initialContent = "" 
}) {
  
  async function imageUploadHandler(file) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${API_URL}/api/blogs/upload-image`, {
    method: 'POST',
    body: formData
  });
  const json = await response.json();
  return json.url;
}

  return (
    <MDXEditor
      markdown={initialContent || ""}
      onChange={onChange}
      className="mdxeditor-root" 
      plugins={[
        headingsPlugin(), 
        listsPlugin(), 
        linkPlugin(), 
        linkDialogPlugin(),
        imagePlugin({ imageUploadHandler }), 
        tablePlugin(), 
        thematicBreakPlugin(), 
        markdownShortcutPlugin(),
        quotePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
        codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', html: 'HTML' } }),
        directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
        frontmatterPlugin(),
        diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' }),
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <CodeToggle />
              <Separator />
              <StrikeThroughSupSubToggles /> 
              <Separator />
              <HighlightToggle />
              <Separator />
              <ListsToggle />
              <Separator />
              <BlockTypeSelect />
              <Separator />
              <CreateLink />
              <InsertImage />
              <InsertTable />
              <InsertThematicBreak />
              <InsertCodeBlock />
              <InsertAdmonition />
              <Separator />
              <InsertFrontmatter />
            </DiffSourceToggleWrapper>
          )
        })
      ]}
    />
  );
}