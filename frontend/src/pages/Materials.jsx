import React, { useMemo, useState } from 'react'
import styles from 'styles/presStyle.module.css'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Item from '../components/Item'
import AddButton from 'components/AddButton'
import { useParams } from 'react-router-dom'
import TextEditor from 'components/TextEditor'
import { useMutation } from '@tanstack/react-query'

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

  const addItemAPI = useMutation({
    mutationFn: data => axios.post('/api/teachersMaterials', data),
    onSuccess: res => {},
    onError: res => {}
  })
  const setItemAPI = useMutation({
    mutationFn: data => axios.post('/api/teachersMaterials/' + data.id, data.theme),
    onSuccess: res => {},
    onError: res => {}
  })

  const add = () => {
    const newItem = { id: Date.now(), value: '' };

    setTheme(prevTheme => [...prevTheme, newItem]);

    addItemAPI.mutate(newItem);
  }

  const exit = () => {
    setUserId('');

    localStorage.setItem('id', '');
  }

  const saveItem = (e) => {
    setTheme(prev => {
      const theme = prev.find(theme => theme.id === +id);

      theme.value = e.target.textContent;
      console.log(theme)
      setItemAPI.mutate({id, theme})

      return [...prev];
    });
  }

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
              <Item key={item.id} index={item.id} saveChanges={saveItem} setIsEditable={setIsEditable}>{item.value}</Item>
            ))
          }

          <motion.button whileTap={{ scale: .9 }} onClick={add}>+</motion.button>
        </motion.div>
        <div className={styles.editor}>
          <TextEditor className={styles.textEditor} />
          
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