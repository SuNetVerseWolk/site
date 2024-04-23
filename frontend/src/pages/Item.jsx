import React from 'react'
import { motion } from 'framer-motion'

const Item = ({ index }) => {
  return (
    <>
        <motion.div whileInView={{scale: 1}} initial={{scale: .9}}></motion.div>
    </>
  )
}

export default Item