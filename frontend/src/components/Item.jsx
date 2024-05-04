import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom';

const Item = ({ index, teacherID, children, isEditable, setIsEditable, saveChanges, mayEdite = true }) => {
  const linkRef = useRef();
  console.log(`./${index}/${teacherID}`)

  return (
    <motion.div whileInView={{ scale: 1 }} initial={{ scale: .9 }} id='activeItem' onBlur={e => saveChanges(e, index)} onClick={e => {
        if (mayEdite) setIsEditable(true);

        linkRef.current.focus();
        linkRef.current.click();
      }}>
      <NavLink to={`./${index}/${teacherID}`} ref={linkRef} contentEditable={isEditable}>{children}</NavLink>
    </motion.div>
  )
}

export default Item