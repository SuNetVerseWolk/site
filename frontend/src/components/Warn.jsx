import React from 'react'
import styles from 'styles/formStyle.module.css';
import { motion } from 'framer-motion'

const Warn = ({ children, localRef }) => {
    return (
        <motion.div ref={localRef} className={styles.warn} initial={{scaleY: .1}}>{children}</motion.div>
    )
}

export default Warn