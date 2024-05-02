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
import FontSizeInput from 'components/FontSizeInput'
import ColorInput from 'components/ColorInput'

const Materials = ({ setUserInfo, userInfo }) => {
  const queryClient = useQueryClient();
  const { id, teacherID } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const navigator = useNavigate();
  const isTeacher = useMemo(e => userInfo.type === 'teachers', [userInfo]);
  const [fontSize, setFontSize] = useState('');

  const inputs = useMemo(e => [
    {
      name: 'foreColor',
      text: 'Цвет текста',
      id: 'textColor',
      defaultValue: '#000000'
    },
    {
      name: 'hiliteColor',
      text: 'Фон текста',
      id: 'textBackColor',
      defaultValue: '#ffffff'
    }
  ], []);

  const userData = useQuery({
    queryKey: [userInfo.type, userInfo.id],
    queryFn: e => axios.get(`/api/${userInfo.type}/${userInfo.id}`).then(data => data.data)
  });
  const { data: values, isLoading } = useQuery({
    queryKey: ['teachersMaterials', teacherID || userInfo.id],
    queryFn: e => axios.get(`/api/teachersMaterials?teacherID=${isTeacher ? userInfo.id : teacherID}`)
      .then(data => {
        return data.data
      }
    )
  });
  const { data: teacehrs, isLoading: isTeachersLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: e => axios.get('/api/teachers')
      .then(data => {
        return data.data
      }
    )
  });
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
  ], []);
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
    mutationFn: async data => await axios.post(`/api/teachersMaterials?teacherID=${userInfo.id}`, { id: Date.now(), value: '' }),
    onSuccess: res => {
      queryClient.invalidateQueries(['teachersMaterials'])
    },
    onError: res => {
    },
    retry: 3
  });
  const { mutate: setItemAPI } = useMutation({
    mutationFn: async data => await axios.post(`/api/teachersMaterials/${data.id}?teacherID=${userInfo.id}`, data.value),
    onMutate: res => {
      setIsEditable(false);
    },
    onSuccess: res => {
      queryClient.invalidateQueries(['teachersMaterials'])
    },
    onError: res => { }
  });
  const { mutate: deleteItemAPI } = useMutation({
    mutationFn: async data => {
      return await axios.delete(`/api/teachersMaterials/${id}?teacherID=${userInfo.id}`).then(data => data)
    },
    onSuccess: res => {
      queryClient.invalidateQueries(['teachersMaterials'])
    },
    onError: res => {
    },
    retry: 3
  });

  const exit = () => {
    setUserInfo('');

    localStorage.setItem('info', '');
  }

  const saveItem = (e, id) => {
    const data = values.find(data => data.id === +id);
    console.log({ id: id, value: { ...data, value: e.target.textContent } })

    setItemAPI({ id: id, value: { ...data, value: e.target.textContent } });
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
            isLoading ? (
              <div className={styles.warn}>Загрузка...</div>
            ) : (
              values?.length ? (
                values.map((item) => (
                  <Item
                    key={item.id}
                    index={item.id}
                    teacherID={teacherID}
                    saveChanges={saveItem}
                    isEditable={isEditable}
                    setIsEditable={setIsEditable}
                    mayEdite={isTeacher}
                  >
                    {item.value}
                  </Item>
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

          {isTeacher ? (
            <div className={styles.addElementsContainer}>
                  <div className={styles.textEditorContainer}>
                    <FontSizeInput
                      setFontSize={setFontSize}
                      fontSize={fontSize}
                      className={styles.fontSizeContainer}
                    />

                    {inputs.map((input, i) => <ColorInput key={i} input={input} />)}
                  </div>

                  <div className={styles.positionContainer}>
                    {
                      positionBtns.map((button, i) => <AddButton key={i} {...button} tapAnim={false}>{button.text}</AddButton>)
                    }
                  </div>

                  {
                    buttonSrcs.map((button, i) => <AddButton key={i} {...button}>{button.text}</AddButton>)
                  }
            </div>
          ) : (
            <motion.div className={styles.asideBar}>
              {
                isTeachersLoading ? (
                  <div className={styles.warn}>Загрузка...</div>
                ) : (
                  teacehrs?.length ? (
                    teacehrs.map((item) => (
                      <Item
                        key={item.id}
                        index={+id}
                        teacherID={item.id}
                        saveChanges={saveItem}
                        isEditable={isEditable}
                        setIsEditable={setIsEditable}
                        mayEdite={isTeacher}
                      >
                        {item.name}
                      </Item>
                    ))
                  ) : (
                    <motion.div whileInView={{ scale: 1 }} initial={{ scale: .9 }} className={styles.warn}>Пусто</motion.div>
                  )
                )
              }
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Materials