import React from 'react'

const ColorInput = ({ input }) => {
    return (
        <div>
            <input
                onInput={e => document.execCommand(input.name, false, e.target.value)}
                {...input}
                type='color'
            />
            <label htmlFor={input.id}>
                {input.text}
            </label>
        </div>
    )
}

export default ColorInput