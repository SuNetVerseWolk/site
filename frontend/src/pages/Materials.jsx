import React, { useState } from 'react'
import styles from 'styles/presStyle.module.css'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Item from '../components/Item'

const Materials = ({ setUserId, userId }) => {
  const [theme, setTheme] = useState([]);

  const { data } = useQuery({
    queryKey: [userId],
    queryFn: e => axios.get(`/api/teacher/${userId}`).then(data => data.data)
  })

  const add = () => {
    const newItem = { id: Date.now(), title: 'New Item' };
    
    setTheme(prevTheme => [...prevTheme, newItem]);

    console.log(newItem.id);
  }

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

          <motion.button whileTap={{ scaleX: .85, scaleY: .95 }} onClick={exit}><img src="/logout.png" alt="..." /></motion.button>
        </div>
      </header>

      <div>
        <motion.div className={styles.asideBar}>
          <Item></Item>

          {
            theme.map((item, index) => (
              <Item key={index}/>
            ))
          }

          <motion.button whileTap={{ scale: .9 }} onClick={add}>+</motion.button>
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