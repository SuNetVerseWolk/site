import React from 'react'

const TextEditor = ({ ref, className }) => {
  return (
    <div ref={ref} className={className} contentEditable>
      
    </div>
  )
}

export default TextEditor
