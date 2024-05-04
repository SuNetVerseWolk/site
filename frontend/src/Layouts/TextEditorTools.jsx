import AddButton from 'components/AddButton'
import ColorInput from 'components/ColorInput'
import FontSizeInput from 'components/FontSizeInput'
import React from 'react'
import {
	addElementsContainer,
	textEditorContainer,
	fontSizeContainer,
	positionContainer,
} from 'styles/presStyle.module.css'

const TextEditorTools = ({ setFontSize, fontSize, inputs, positionBtns, buttonSrcs, isPending }) => {
	return (
		<div className={addElementsContainer}>
			<div className={textEditorContainer}>
				<FontSizeInput
					setFontSize={setFontSize}
					fontSize={fontSize}
					className={fontSizeContainer}
				/>

				{inputs.map((input, i) => <ColorInput key={i} input={input} />)}
			</div>

			<div className={positionContainer}>
				{
					positionBtns.map((button, i) => <AddButton key={i} {...button} tapAnim={false}>{button.text}</AddButton>)
				}
			</div>

			{
				buttonSrcs.map((button, i) => {
					console.log(button.style, isPending)
					return (
						<AddButton
							key={i}
							{...button}
							style={button.style && isPending && button.style}
						>{button.text}</AddButton>
					)
				})
			}
		</div>
	)
}

export default TextEditorTools
