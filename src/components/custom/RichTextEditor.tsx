// components/RichTextEditor.tsx
import {
    EditorContent,
    useEditor,
  } from "@tiptap/react"
  import StarterKit from "@tiptap/starter-kit"
  import Underline from "@tiptap/extension-underline"
  
  import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
  
  export default function RichTextEditor({
    value,
    onChange,
  }: {
    value: string
    onChange: (val: string) => void
  }) {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
        }),
        Underline,
      ],
      content: value,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML())
      },
    })
  
    if (!editor) return null
  
    return (
      <div className="border rounded-lg p-2 space-y-2">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 border-b pb-2 mb-2">
          <ToggleGroup type="multiple" className="flex flex-wrap gap-2">
            <ToggleGroupItem
              value="bold"
              aria-pressed={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              Bold
            </ToggleGroupItem>
            <ToggleGroupItem
              value="italic"
              aria-pressed={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              Italic
            </ToggleGroupItem>
            <ToggleGroupItem
              value="underline"
              aria-pressed={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              Underline
            </ToggleGroupItem>
            <ToggleGroupItem
              value="heading1"
              aria-pressed={editor.isActive("heading", { level: 1 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              H1
            </ToggleGroupItem>
            <ToggleGroupItem
              value="heading2"
              aria-pressed={editor.isActive("heading", { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              H2
            </ToggleGroupItem>
            <ToggleGroupItem
              value="heading3"
              aria-pressed={editor.isActive("heading", { level: 3 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              H3
            </ToggleGroupItem>
            <ToggleGroupItem
              value="paragraph"
              aria-pressed={editor.isActive("paragraph")}
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              P
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
  
        <EditorContent editor={editor} className="min-h-[200px]" />
      </div>
    )
  }
  