import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom';

const Item = ({ index, children, setIsEditable, saveChanges }) => {
  const linkRef = useRef();

  return (
    <motion.div whileInView={{ scale: 1 }} initial={{ scale: .9 }} id='activeItem' onBlur={saveChanges} onClick={e => {
        setIsEditable(true);

        linkRef.current.click();
      }}>
      <NavLink to={`${index}`} ref={linkRef} contentEditable>{children}</NavLink>
    </motion.div>
  )
}

export default Item