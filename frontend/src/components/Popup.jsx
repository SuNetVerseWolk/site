import React from 'react'
import { motion } from 'framer-motion'
import styles from 'styles/presStyle.module.css';

const Popup = () => {
  return (
    <motion.div
        initial={{ scale: .80 }}
        animate={{ scale: 1 }} className={styles.popup}>
        {/* <label htmlFor="name">ФИО</label> */}
        <input id='name' name='name' type="text" />

        {/* <label htmlFor="password">Пароль</label> */}
        <input id='password' name='password' type="text" />

        <motion.button whileTap={{ scaleX: .85, scaleY: .95 }}>Изменить</motion.button>
    </motion.div>
  )
}

export default Popup