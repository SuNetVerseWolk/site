import React from 'react'

const FontSizeInput = ({ setFontSize, className, fontSize }) => {
  return (
    <div className={className}>
      <div>
        <input
          id='textSize'
          maxLength={2}
          defaultValue={20}
          onInput={e => setFontSize(e.target.value)}
        />
        <label htmlFor='textSize'>
          Размер текста
        </label>
      </div>

      <button onClick={e => {
        document.execCommand('fontSize', false, fontSize.slice(0, 1));
      }}><img src="/tick.png" alt="..." /></button>
    </div>
  )
}

export default FontSizeInput