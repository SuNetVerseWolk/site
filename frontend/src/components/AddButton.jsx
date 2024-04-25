import React from 'react'
import { motion } from 'framer-motion'

const AddButton = ({ children, img }) => {
  console.log(children);
  return (
      <motion.button whileTap={{ scale: .9 }} style={{'--text': `'${children ? children : ''}'`}}>
        <img src={img} alt="..." />
      </motion.button>
  )
}

export default AddButton
