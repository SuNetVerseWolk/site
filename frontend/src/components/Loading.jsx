import React from 'react'

const Loading = ({ children = 'Загрузка...', styles={} }) => {
	return (
		<div style={{...{
			height: '100%',
			display: 'grid',
			placeItems: 'center',
			color: '#dae1ea'
		}, ...styles}}>
			<h1>{children}</h1>
		</div>
	)
}

export default Loading
