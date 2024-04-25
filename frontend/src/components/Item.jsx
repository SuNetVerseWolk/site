import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom';

const Item = ({ index, children, isEditable, setIsEditable, saveChanges }) => {
  const linkRef = useRef();

  return (
    <motion.div whileInView={{ scale: 1 }} initial={{ scale: .9 }} id='activeItem' onBlur={saveChanges} onClick={e => {
        setIsEditable(true);

        linkRef.current.click();
      }}>
      <NavLink to={`${index}`} ref={linkRef} contentEditable={isEditable}>{children}</NavLink>
    </motion.div>
  )
}

export default Item