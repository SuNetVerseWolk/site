import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from 'styles/presStyle.module.css'
import { motion } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Item from '../components/Item'
import AddButton from 'components/AddButton'
import { useNavigate, useParams } from 'react-router-dom'
import TextEditor from 'components/TextEditor'
import { useMutation } from '@tanstack/react-query'

const Materials = ({ setUserInfo, userInfo }) => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const navigator = useNavigate();
  const isTeacher = useMemo(e => userInfo.type === 'teacher', [userInfo]);
  const [fontSize, setFontSize] = useState('');

  const inputs = useMemo(e => [
    // {
    //   type: 'text',
    //   name: 'fontSize',
    //   text: 'Размер текста',
    //   id: 'textSize',
    //   defaultValue: 10
    // },
    {
      // type: 'color',
      name: 'foreColor',
      text: 'Цвет текста',
      id: 'textColor',
      defaultValue: '#000000'
    },
    {
      // type: 'color',
      name: 'hiliteColor',
      text: 'Фон текста',
      id: 'textBackColor',
      defaultValue: '#ffffff'
    }
  ], [])

  const userData = useQuery({
    queryKey: [userInfo.type, userInfo.id],
    queryFn: e => axios.get(`/api/${userInfo.type}/${userInfo.id}`).then(data => data.data)
  })
  const { data: values, isLoading } = useQuery({
    queryKey: [isTeacher ? 'teachersMaterials' : 'teachers'],
    queryFn: e => axios.get(`/api/${isTeacher ? 'teachersMaterials' : 'teachers'}`).then(data => {
      return data.data
    }),
    staleTime: Infinity,
  })
  const positionBtns = useMemo(e => [
    {
      src: '/left.png',
      text: 'Лево',
      onClick: e => document.execCommand('JustifyLeft')
    }, {
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
      src: '/save.png',
      text: 'Сохранить',
      // onClick: e => deleteItemAPI()
    },
    {
      src: '/delete.png',
      onClick: e => deleteItemAPI()
    }
  ], [id]);

  const { mutate: addItemAPI } = useMutation({
    mutationFn: data => axios.post('/api/teachersMaterials', { id: Date.now(), value: '' }),
    onSuccess: res => {
      queryClient.invalidateQueries(['teachersMaterials'])
    },
    onError: res => { }
  })
  const setItemAPI = useMutation({
    mutationFn: data => axios.post('/api/teachersMaterials/' + data.id, data.value),
    onSuccess: res => {
      queryClient.invalidateQueries(['teachersMaterials'])
    },
    onError: res => { }
  })
  const { mutate: deleteItemAPI } = useMutation({
    mutationFn: data => {
      console.log('/api/teachersMaterials/' + id)
      axios.delete('/api/teachersMaterials/' + id).then(data => console.log(data))
    },
    onSuccess: res => {
      queryClient.invalidateQueries(['teachersMaterials'])
    },
    onError: res => { }
  })

  const exit = () => {
    setUserInfo('');

    localStorage.setItem('info', '');
  }

  const saveItem = (e) => {
    setTimeout(() => {
      const data = values.find(data => data.id === +id);

      setItemAPI.mutate({ id: id, value: { ...data, value: e.target.textContent } });
    });

    setIsEditable(false);
  }

  console.log(fontSize);

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
            isLoading ? (
              <div className={styles.warn}>Загрузка...</div>
            ) : (
              values.length ? (
                values.map((item) => (
                  <Item key={item.id} index={item.id} saveChanges={saveItem} isEditable={isEditable} setIsEditable={setIsEditable} mayEdite={isTeacher ? true : false}>{isTeacher ? item.value : item.name}</Item>
                ))
              ) : (
                <motion.div whileInView={{ scale: 1 }} initial={{ scale: .9 }} className={styles.warn}>Пусто</motion.div>
              )
            )
          }

          {isTeacher && (
            <motion.button whileTap={{ scale: .9 }} onClick={addItemAPI}>+</motion.button>
          )}
        </motion.div>
        <div className={styles.editor}>
          <TextEditor className={styles.textEditor} />

          <div className={styles.addElementsContainer}>
            {isTeacher && (
              <>
                <div className={styles.textEditorContainer}>
                  <div className={styles.fontSizeContainer}>
                    <div>
                      <input
                        id='textSize'
                        max={72}
                        defaultValue={20}
                        onInput={e => setFontSize(e.target.value)}
                      />
                      <label htmlFor='textSize'>
                        Размер текста
                      </label>
                    </div>

                    <button onClick={e => {
                      document.execCommand('fontSize', false, fontSize.slice(0, 1));

                      console.log(fontSize);
                    }}><img src="/tick.png" alt="..." /></button>
                  </div>
                  {
                    inputs.map((input, i) => {
                      return (
                        <div key={i}>
                          <input
                            onInput={e => document.execCommand(input.name, false, e.target.value)}
                            {...input}
                            type='color'
                            max={72}
                          // value={input.value[0] === '#' ? input.value : parseInt(input.value)}
                          />
                          <label htmlFor={input.id}>
                            {input.text}
                          </label>
                        </div>
                      )
                    })
                  }
                </div>

                <div className={styles.positionContainer}>
                  {
                    positionBtns.map((button, i) => <AddButton key={i} {...button} tapAnim={false}>{button.text}</AddButton>)
                  }
                </div>

                {
                  buttonSrcs.map((button, i) => <AddButton key={i} {...button}>{button.text}</AddButton>)
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