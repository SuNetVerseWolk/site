import React from 'react'
import styles from 'styles/presStyle.module.css'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const Materials = ({ setUserId, userId }) => {
  const { data } = useQuery({
    queryKey: [userId],
    queryFn: e => axios.get(`/api/teacher/${userId}`).then(data => data.data)
  })

  const exit = () => {
    setUserId('');

    localStorage.setItem('id', '');
  }

  return (
    <div className={styles.presContainer}>
      <header>
        <h1>Презентация</h1>

        <div>
          <p>{data?.name}</p>

          <motion.button whileTap={{ scaleX: .85, scaleY: .95 }} onClick={exit}><img src="/exit.png" alt="..." /></motion.button>
        </div>
      </header>

      <div>
        <motion.div className={styles.asideBar}>
          <motion.div whileInView={{scale: 1}} initial={{scale: .9}}></motion.div>
          <motion.div whileInView={{scale: 1}} initial={{scale: .9}}></motion.div>
          <motion.div whileInView={{scale: 1}} initial={{scale: .9}}></motion.div>
          <motion.div whileInView={{scale: 1}} initial={{scale: .9}}></motion.div>
          <motion.div whileInView={{scale: 1}} initial={{scale: .9}}></motion.div>
          <motion.div whileInView={{scale: 1}} initial={{scale: .9}}></motion.div>
          <motion.div whileInView={{scale: 1}} initial={{scale: .9}}></motion.div>
          <motion.div whileInView={{scale: 1}} initial={{scale: .9}}></motion.div>
          <motion.div whileInView={{scale: 1}} initial={{scale: .9}}></motion.div>
          <motion.div whileInView={{scale: 1}} initial={{scale: .9}}></motion.div>
          <motion.div whileInView={{scale: 1}} initial={{scale: .9}}></motion.div>
          <motion.div whileInView={{scale: 1}} initial={{scale: .9}}></motion.div>

          <motion.button whileTap={{ scale: .9 }}>+</motion.button>
        </motion.div>
        <div className={styles.editor}>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default Materials