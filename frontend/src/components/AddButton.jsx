import React from 'react'
import { motion } from 'framer-motion'

const AddButton = ({ children, src, onClick, tapAnim = true, style }) => {
  return (
    <motion.button whileTap={tapAnim ? { scale: .9 } : {}} onClick={onClick} style={{'--text': `'${children ? children : ''}'`, ...style, '--color': `${style?.color || '#6dabe4'}`}}>
      <img src={src} alt="..." />
    </motion.button>
  )
}

export default AddButton
