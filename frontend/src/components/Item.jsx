import React from 'react'
import { motion } from 'framer-motion'

const autoResize = (e) =>{
  e.target.style.height = 'auto';
  e.target.style.height = e.target.scrollHeight + 'px';
}

const Item = ({ index, children }) => {
  return (
    <motion.div whileInView={{ scale: 1 }} initial={{ scale: .9 }} >
      <textarea onInput={autoResize} contentEditable>{children}</textarea>
    </motion.div>
  )
}

export default Item