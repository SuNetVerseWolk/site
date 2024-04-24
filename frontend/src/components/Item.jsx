import React from 'react'
import { calcLength, motion } from 'framer-motion'
import { NavLink } from 'react-router-dom';

const Item = ({ index, children, setIsEditable }) => {
  return (
    <motion.div whileInView={{ scale: 1 }} initial={{ scale: .9 }} onClick={e => setIsEditable(true)}>
      <NavLink to={`${index}`}>{children}</NavLink>
    </motion.div>
  )
}

export default Item