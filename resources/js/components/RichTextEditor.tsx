import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
    value?: string
    onChange: (content: string) => void
    placeholder?: string
    className?: string
}

const RichTextEditor = ({ value, onChange, placeholder = 'Write something...', className }: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-pink-600 hover:text-pink-700 underline',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base focus:outline-hidden min-h-[150px] px-3 py-2',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className={cn("border border-input bg-transparent rounded-md shadow-xs", className)}>
            <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-1">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={cn(
                        "p-2 rounded-md hover:bg-muted transition-colors",
                        editor.isActive('bold') ? 'bg-muted text-primary' : 'text-muted-foreground'
                    )}
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={cn(
                        "p-2 rounded-md hover:bg-muted transition-colors",
                        editor.isActive('italic') ? 'bg-muted text-primary' : 'text-muted-foreground'
                    )}
                >
                    <Italic className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-border mx-1" />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(
                        "p-2 rounded-md hover:bg-muted transition-colors",
                        editor.isActive('bulletList') ? 'bg-muted text-primary' : 'text-muted-foreground'
                    )}
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(
                        "p-2 rounded-md hover:bg-muted transition-colors",
                        editor.isActive('orderedList') ? 'bg-muted text-primary' : 'text-muted-foreground'
                    )}
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-border mx-1" />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn(
                        "p-2 rounded-md hover:bg-muted transition-colors",
                        editor.isActive('blockquote') ? 'bg-muted text-primary' : 'text-muted-foreground'
                    )}
                >
                    <Quote className="w-4 h-4" />
                </button>
                <div className="ml-auto flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                        className="p-2 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-50"
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                        className="p-2 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-50"
                    >
                        <Redo className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}

export default RichTextEditor