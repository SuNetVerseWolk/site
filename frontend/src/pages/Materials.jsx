import React, { useMemo, useState } from 'react'
import styles from 'styles/presStyle.module.css'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Item from '../components/Item'
import AddButton from 'components/AddButton'
import { useParams } from 'react-router-dom'
import TextEditor from 'components/TextEditor'

const Materials = ({ setUserId, userId }) => {
  const [themes, setTheme] = useState([]);
  const { id } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const buttonSrcs = useMemo(e => [
    {
      src: '/heading.png',
      text: 'Заголовок'
    },
    {
      src: '/text.png',
      text: 'Текст'
    },
    {
      src: '/delete.png',
    }
  ], []);

  const userData = useQuery({
    queryKey: [userId],
    queryFn: e => axios.get(`/api/teacher/${userId}`).then(data => data.data)
  })
  const values = useQuery({
    queryKey: [id],
    queryFn: e => axios.get(`/api/teachersMaterials`).then(data => {
      setTheme(data.data);
      return data.data;
    }),
  })

  const add = () => {
    const newItem = { id: Date.now(), value: '' };

    setTheme(prevTheme => [...prevTheme, newItem]);

    console.log(newItem.id);
  }

  const exit = () => {
    setUserId('');

    localStorage.setItem('id', '');
  }

  console.log(isEditable);

  return (
    <div className={styles.presContainer}>
      <header>
        <h1>Материал для обучения</h1>

        <div>
          <p>{userData.data?.name}</p>

          <motion.button whileTap={{ scaleX: .85, scaleY: .95 }} onClick={exit}><img src="/logout.png" alt="..." /></motion.button>
        </div>
      </header>

      <div>
        <motion.div className={styles.asideBar}>
          {
            themes.map((item) => (
              <Item key={item.id} index={item.id} setIsEditable={setIsEditable}>{item.value}</Item>
            ))
          }

          <motion.button whileTap={{ scale: .9 }} onClick={add}>+</motion.button>
        </motion.div>
        <div className={styles.editor}>
          <TextEditor className={styles.textEditor} />
          {/* <div className={styles.main}>
            <h1 contentEditable onBlur={e => setTheme(prev => {
              console.log(prev);
              console.log(prev.find(item => item.id === id));
              prev.find(item => item.id === +id).value = e.target.textContent;

              // setCursorPosition(e.target);

              return [...prev];
            })}>{themes.find(item => item.id === +id)?.value}</h1>
          </div> */}
          <div className={styles.addElementsContainer}>
            {
              buttonSrcs.map((button) => <AddButton key={button.src} img={button.src}>{button.text}</AddButton>)
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Materials