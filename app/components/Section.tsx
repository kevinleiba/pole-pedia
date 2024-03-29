import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import classNames from 'classnames'
import React, { useCallback, useEffect, useRef } from 'react'
import Link from '@tiptap/extension-link'

interface SectionProps {
  content?: string,
  onBlur: (content: string) => void
}

function Section({ content, onBlur }: SectionProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        // openOnClick: false,
      }),
    ],
    content,
    onBlur({ editor }) {
      onBlur(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "border border-darkGrey p-s min-h-[300px] rounded rounded-m"
      }
    }
  })

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink()
        .run()

      return
    }

    // update link
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div>
      {editor && <BubbleMenu tippyOptions={{ duration: 100 }} editor={editor}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={classNames({ 'bold': editor.isActive('bold') }, "editorButton")}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={classNames({ 'bold': editor.isActive('italic') }, "editorButton")}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={classNames({ 'bold': editor.isActive('strike') }, "editorButton")}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={classNames({ 'bold': editor.isActive('codeBlock') }, "editorButton")}
        >
          Code Block
        </button>
        <button onClick={setLink}
          className={classNames({ 'bold': editor.isActive('link') }, "editorButton")}
        >
          Link
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          className={classNames({ 'bold': editor.isActive('link') }, "editorButton")}
        >
          Remove Link
        </button>
      </BubbleMenu>}
      <EditorContent editor={editor} />
    </div>
  )
}

export default Section