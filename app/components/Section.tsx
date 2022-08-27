import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import classNames from 'classnames'
import React, { useEffect, useRef } from 'react'

interface SectionProps { }

function Section({ }: SectionProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: `
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus mauris a diam maecenas sed. Amet porttitor eget dolor morbi non arcu risus quis. Libero nunc consequat interdum varius sit amet mattis vulputate. Quis hendrerit dolor magna eget est lorem. Dictumst quisque sagittis purus sit. Porta nibh venenatis cras sed. Enim sed faucibus turpis in eu. Imperdiet sed euismod nisi porta lorem mollis aliquam. Eget dolor morbi non arcu risus quis varius quam quisque. Pellentesque dignissim enim sit amet venenatis urna cursus. Natoque penatibus et magnis dis parturient montes nascetur ridiculus. Integer feugiat scelerisque varius morbi enim nunc faucibus a. A arcu cursus vitae congue mauris rhoncus. Id aliquet risus feugiat in ante metus dictum at tempor. Eu scelerisque felis imperdiet proin.</p>

    <p>Tincidunt praesent semper feugiat nibh sed pulvinar. Placerat orci nulla pellentesque dignissim enim sit amet. Convallis posuere morbi leo urna molestie at elementum eu. Id faucibus nisl tincidunt eget nullam non nisi. Nibh sit amet commodo nulla facilisi nullam vehicula ipsum. Vehicula ipsum a arcu cursus vitae congue mauris rhoncus aenean. Congue eu consequat ac felis donec et odio. Risus nullam eget felis eget nunc lobortis mattis aliquam faucibus. Morbi leo urna molestie at elementum eu. Fringilla urna porttitor rhoncus dolor purus non enim.</p>
    
    <p>Sit amet venenatis urna cursus eget nunc scelerisque. Orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Metus aliquam eleifend mi in nulla posuere. Nunc sed id semper risus. Placerat vestibulum lectus mauris ultrices eros in cursus turpis. Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Tristique sollicitudin nibh sit amet commodo. Sed velit dignissim sodales ut eu sem integer. Ultrices in iaculis nunc sed augue. Vitae suscipit tellus mauris a diam maecenas sed enim ut. Augue neque gravida in fermentum. Volutpat maecenas volutpat blandit aliquam etiam. Nunc mattis enim ut tellus elementum sagittis vitae et. Mauris a diam maecenas sed enim ut sem viverra aliquet. Non blandit massa enim nec dui nunc mattis enim. Volutpat consequat mauris nunc congue nisi vitae suscipit tellus mauris. Porta non pulvinar neque laoreet suspendisse interdum consectetur libero. In pellentesque massa placerat duis ultricies lacus sed turpis. Malesuada fames ac turpis egestas maecenas. Ultricies lacus sed turpis tincidunt.</p>
    
    <p>Vestibulum lectus mauris ultrices eros in cursus turpis massa. Sollicitudin ac orci phasellus egestas tellus rutrum tellus. Et malesuada fames ac turpis egestas integer. Enim facilisis gravida neque convallis a cras semper auctor. Quisque egestas diam in arcu cursus euismod quis viverra. Pharetra diam sit amet nisl suscipit. Volutpat lacus laoreet non curabitur gravida. Amet justo donec enim diam vulputate ut. Facilisis mauris sit amet massa vitae tortor. Quis imperdiet massa tincidunt nunc. Nibh nisl condimentum id venenatis a condimentum vitae sapien. Sed enim ut sem viverra aliquet eget sit amet.</p>
    
    <p>Etiam dignissim diam quis enim lobortis scelerisque fermentum. Sem nulla pharetra diam sit amet nisl. Tellus orci ac auctor augue mauris augue. Posuere ac ut consequat semper viverra nam libero justo. Tortor condimentum lacinia quis vel eros donec ac odio. Tortor id aliquet lectus proin. Lobortis feugiat vivamus at augue eget arcu dictum varius duis. Nulla pellentesque dignissim enim sit. Accumsan in nisl nisi scelerisque eu ultrices vitae auctor eu. Dui vivamus arcu felis bibendum ut tristique et egestas quis. Vitae justo eget magna fermentum iaculis eu non. Volutpat sed cras ornare arcu dui vivamus arcu felis. Cursus turpis massa tincidunt dui ut ornare lectus sit amet. Sit amet nisl purus in mollis nunc sed id semper. Praesent semper feugiat nibh sed pulvinar proin gravida. Eget arcu dictum varius duis at consectetur lorem donec. Tempor orci eu lobortis elementum. Egestas diam in arcu cursus euismod quis viverra nibh cras. Etiam non quam lacus suspendisse faucibus interdum. Pellentesque habitant morbi tristique senectus et netus et malesuada.</p>
`,
  })

  return (
    <div className='my-xl'>
      {editor && <BubbleMenu className="bg-lightGrey border border-darkGrey px-xs py-xs" tippyOptions={{ duration: 100 }} editor={editor}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={classNames({ 'bold': editor.isActive('bold') }, "mr-m hover:underline")}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={classNames({ 'bold': editor.isActive('italic') }, "mr-m hover:underline")}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={classNames({ 'bold': editor.isActive('strike') }, "mr-m hover:underline")}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={classNames({ 'bold': editor.isActive('codeBlock') }, "hover:underline")}
        >
          code block
        </button>
      </BubbleMenu>}
      <EditorContent editor={editor} />
    </div>
  )
}

export default Section