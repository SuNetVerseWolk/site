import React, { useEffect, useMemo, useRef, useState } from 'react'
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
  const textEditorRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  const buttonSrcs = useMemo(e => [
    {
      src: '/heading.png',
      text: 'Заголовок',
      onClick: e => {
        document.execCommand('formatBlock', false, 'h1')
      }
    },
    {
      src: '/text.png',
      text: 'Текст',
      onClick: e => {
        document.execCommand('formatBlock', false, 'p')
      }
    },
    {
      src: '/cursive.png',
      text: 'Курсив',
      onClick: e => {
        document.execCommand('Italic', false, 'p')
      }
    },
    {
      src: '/underline.png',
      text: 'Подчеркивание',
      onClick: e => {
        document.execCommand('underline')
      }
    },
    {
      src: '/delete.png',
      onClick: e => {
        deleteItemAPI.mutate(+id)
      }
    }
  ], [themes]);


  useEffect(() => {
    setActiveIndex(0);
  }, []);

  const userData = useQuery({
    queryKey: [userId],
    queryFn: e => axios.get(`/api/teacher/${userId}`).then(data => data.data)
  })
  const values = useQuery({
    queryKey: ['teachersMaterials'],
    queryFn: e => axios.get(`/api/teachersMaterials`).then(data => data.data),
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
  const deleteItemAPI = useMutation({
    mutationFn: data => axios.delete('/api/teachersMaterials/' + data),
    onSuccess: res => {
      setTheme(prev => prev.filter(item => item.id !== +id));
    },
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
    setIsEditable(false);
    setTheme(prev => {
      const theme = prev.find(theme => theme.id === +id);

      theme.value = e.target.textContent;
      console.log(theme)
      setItemAPI.mutate({id, theme})

      return [...prev];
    });
  }

  useEffect(e => {
    setTheme(values.data || []);
  }, [values.data]);

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
            values.isLoading ? (
              <div className={styles.warn}>Загрузка...</div>
            ) : (
              themes.length ? (
                themes.map((item) => (
                  <Item key={item.id} index={item.id} saveChanges={saveItem} isEditable={isEditable} setIsEditable={setIsEditable}>{item.value}</Item>
                ))
              ) : (
                <motion.div whileInView={{ scale: 1 }} initial={{ scale: .9 }} className={styles.warn}>Пусто</motion.div>
              )
            )
          }

          <motion.button whileTap={{ scale: .9 }} onClick={add}>+</motion.button>
        </motion.div>
        <div className={styles.editor}>
          <TextEditor ref={textEditorRef} className={styles.textEditor} />
          
          <div className={styles.addElementsContainer}>
            <div className={styles.textEditorCoontainer}>
              <label htmlFor="size">
                Размер:
                <input name='size' type="number" />
              </label>
              <label htmlFor="colorText">
                Цвет текста:
                <input name='colorText' type="color" />
              </label>
              <label htmlFor="colorBackground">
                Цвет фона:
                <input name='colorBackground' type="color" />
              </label>
            </div>

            <div className={styles.positionContainer}>
              <button onClick={e => {
                document.execCommand('JustifyLeft', false, null)
              }}><img src="/left.png" alt="..." /></button>
              <button onClick={e => {
                document.execCommand('JustifyCenter', false, null)
              }}><img src="/cursive.png" alt="..." /></button>
              <button onClick={e => {
                document.execCommand('JustifyRight', false, null)
              }}><img src="/right.png" alt="..." /></button>
            </div>

            {
              buttonSrcs.map((button) => <AddButton {...button}>{button.text}</AddButton>)
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Materials