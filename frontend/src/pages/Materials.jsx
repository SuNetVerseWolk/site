import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from 'styles/presStyle.module.css'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Item from '../components/Item'
import AddButton from 'components/AddButton'
import { useNavigate, useParams } from 'react-router-dom'
import TextEditor from 'components/TextEditor'
import { useMutation } from '@tanstack/react-query'

const Materials = ({ setUserInfo, userInfo }) => {
  const [themes, setTheme] = useState([]);
  const { id } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const textEditorRef = useRef();
  const navigator = useNavigate()
  const isTeacher = useMemo(e => userInfo.type === 'teacher', [userInfo]);

  const inputs = useMemo(e => [
    {
      type: 'text',
      name: 'fontSize',
      text: 'Размер текста',
      id: 'textSize',
      defaultValue: 10
    },
    {
      type: 'color',
      name: 'foreColor',
      text: 'Цвет текста',
      id: 'textColor',
      defaultValue: '#000000'
    },
    {
      type: 'color',
      name: 'hiliteColor',
      text: 'Фон текста',
      id: 'textBackColor',
      defaultValue: '#ffffff'
    }
  ], [])
  const positionBtns = useMemo(e => [
    {
      src: '/left.png',
      text: 'Лево',
      onClick: e => document.execCommand('JustifyLeft')
    },{
      src: '/cursive.png',
      text: 'Центр',
      onClick: e => document.execCommand('JustifyCenter')
    },
    {
      src: '/right.png',
      text: 'Право',
      onClick: e => document.execCommand('JustifyRight')
    },
  ], [])
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
        document.execCommand('Italic')
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
  ], []);

  const userData = useQuery({
    queryKey: [userInfo.id],
    queryFn: e => axios.get(`/api/${userInfo.type}/${userInfo.id}`).then(data => data.data)
  })
  const values = useQuery({
    queryKey: [isTeacher ? 'teachersMaterials' : 'teachers'],
    queryFn: e => axios.get(`/api/${isTeacher ? 'teachersMaterials' : 'teachers'}`).then(data => data.data),
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
    setUserInfo('');

    localStorage.setItem('Info', '');
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
    setTheme(prev => {
      if (!id && values.data?.[0]?.id) {
        console.log(id)
        navigator(`${values.data[0].id}`, {replace: true})
      }

      return values.data || []
    });
  }, [values.data]);

  console.log(userData.data);
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
                  <Item key={item.id} index={item.id} saveChanges={saveItem} isEditable={isEditable} setIsEditable={setIsEditable} mayEdite={isTeacher ? true : false}>{isTeacher ? item.value : item.name}</Item>
                ))
              ) : (
                <motion.div whileInView={{ scale: 1 }} initial={{ scale: .9 }} className={styles.warn}>Пусто</motion.div>
              )
            )
          }

          {isTeacher && (
            <motion.button whileTap={{ scale: .9 }} onClick={add}>+</motion.button>
          )}
        </motion.div>
        <div className={styles.editor}>
          <TextEditor ref={textEditorRef} className={styles.textEditor}/>
          
          <div className={styles.addElementsContainer}>
            {isTeacher && (
              <>
                <div className={styles.textEditorCoontainer}>
                  {
                    inputs.map((input, i) => {
                      return (
                      <div key={i}>
                        <input
                          onInput={e => document.execCommand(input.name, false, e.target.value)}
                          {...input}
                          max={72}
                          // value={input.value[0] === '#' ? input.value : parseInt(input.value)}
                        />
                        <label htmlFor={input.id}>
                          {input.text}
                        </label>
                      </div>
                    )})
                  }
                </div>

                <div className={styles.positionContainer}>
                  {
                    positionBtns.map((button) => <AddButton {...button} tapAnim={false}>{button.text}</AddButton>)
                  }
                </div>

                {
                  buttonSrcs.map((button) => <AddButton {...button}>{button.text}</AddButton>)
                }
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Materials