import React from 'react'
import { motion } from 'framer-motion'

const AddButton = ({ children, src, onClick }) => {
  return (
    <motion.button whileTap={{ scale: .9 }} onClick={onClick} style={{'--text': `'${children ? children : ''}'`}}>
      <img src={src} alt="..." />
    </motion.button>
  )
}

export default AddButton
