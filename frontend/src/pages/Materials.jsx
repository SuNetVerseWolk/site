import React from 'react'
import styles from 'styles/presStyle.module.css'
import { motion } from 'framer-motion'

const Materials = () => {
  return (
    <div className={styles.presContainer}>
      <header>
        <h1>Презентация</h1>

        <div>
          <p>Лу Луин Лоун</p>

          <motion.button whileTap={{scaleX: .85, scaleY: .95}}><img src="/exit.png" alt="..." /></motion.button>
        </div>
      </header>
      
      <div>
        <div className={styles.asideBar}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>

          <motion.button whileTap={{scale: .9}}>+</motion.button>
        </div>
        <div className={styles.editor}>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default Materials