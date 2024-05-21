import React, { useEffect, useMemo, useRef, useState } from 'react'
import { editor, textEditor, presContainer } from 'styles/presStyle.module.css'
import { motion } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import AsideBar from 'src/Layouts/AsideBar'
import styles from 'styles/presStyle.module.css';
import Popup from 'src/Layouts/Popup';
import FormAdmin from 'components/FormAdmin'

const Admin = ({ setUserInfo, userInfo }) => {
  const queryClient = useQueryClient();
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();
  const [open, setIsOpened] = useState(false);

  // const { data: userData, isLoading: userDataIsLoading } = useQuery({
  // 	queryKey: [userInfo.type, userInfo.id],
  // 	queryFn: e => axios.get(`/api/${userInfo.type}/${userInfo.id}`).then(data => data.data)
  // });
  // const { data: teachers, isLoading: isTeachersLoading } = useQuery({
  // 	queryKey: ['teachers'],
  // 	queryFn: e => axios.get('/api/teachers')
  // 		.then(data => {
  // 			if (!teacherID)
  // 				navigate(`/${data.data[0].id}/${data.data[0].id}`, { replace: true });

  // 			return data.data
  // 		}),
  // 	enabled: !isTeacher
  // });
  // const { data: values, isLoading } = useQuery({
  // 	queryKey: ['teachersMaterials', isTeacher ? userInfo.id : teacherID],
  // 	queryFn: e => axios.get(`/api/teachersMaterials?teacherID=${isTeacher ? userInfo.id : teacherID}`)
  // 		.then(data => {
  // 			if (!isTeacher)
  // 				navigate(`/${data.data[0].id}/${teacherID}`, { replace: true });

  // 			if (values && values.length !== data.data.length)
  // 				navigate(`/${data.data[data.data.length - 1].id}/${teacherID}`, { replace: true });

  // 			if (!values && isTeacher)
  // 				navigate(`/${data.data[0].id}/undefined`, { replace: true });

  // 			return data.data;
  // 		}),
  // 	enabled: isTeacher || !!teachers
  // });
  // const { data: text, isLoading: isTextLoading, isFetching } = useQuery({
  // 	queryKey: ['text', id, isTeacher ? userInfo.id : teacherID],
  // 	queryFn: e => axios.get(`/api/text/${id}?teacherID=${isTeacher ? userInfo.id : teacherID}`)
  // 		.then(data => {
  // 			return data.data.text;
  // 		}),
  // 	enabled: !!values
  // });

  const { mutate: addItemAPI } = useMutation({
    mutationFn: async data => await axios.post(`/api/teachersMaterials?teacherID=${userInfo.id}`, { id: Date.now(), value: '' }),
    onSuccess: res => {
      queryClient.invalidateQueries(['teachersMaterials', isTeacher ? userInfo.id : teacherID]);
    },
    onError: res => { },
    retry: 3
  });
  // const { mutate: setItemAPI } = useMutation({
  // 	mutationFn: async data => await axios.post(`/api/teachersMaterials/${data.id}?teacherID=${userInfo.id}`, data.value),
  // 	onMutate: res => {
  // 		setIsEditable(false);
  // 	},
  // 	onSuccess: res => {
  // 		queryClient.invalidateQueries(['teachersMaterials']);
  // 	},
  // 	onError: res => { }
  // });
  // const { mutate: deleteItemAPI } = useMutation({
  // 	mutationFn: async data => {
  // 		return await axios.delete(`/api/teachersMaterials/${id}?teacherID=${userInfo.id}`).then(data => data)
  // 	},
  // 	onSuccess: res => {
  // 		queryClient.invalidateQueries(['teachersMaterials', isTeacher ? userInfo.id : teacherID])
  // 	},
  // 	onError: res => { },
  // 	retry: 3
  // });
  // const { mutate: setTextAPI, isPending } = useMutation({
  // 	mutationKey: ["text", id, isTeacher ? userInfo.id : teacherID],
  // 	mutationFn: data => {
  // 		return axios.post(`/api/text/${id}?teacherID=${isTeacher ? userInfo.id : teacherID}`, { text: textEditorRef.current.innerHTML }).then(data => data);
  // 	},
  // 	onSuccess: res => {
  // 		queryClient.invalidateQueries(['text', res.id, isTeacher ? userInfo.id : teacherID]);
  // 	},
  // 	retry: 3
  // });

  const exit = () => {
    // setUserInfo('');

    // localStorage.removeItem('info', '');
    navigate('/login');
  }

  // const saveItem = (e, id) => {
  // 	const data = values.find(data => data.id === +id);

  // 	setItemAPI({ id: id, value: { ...data, value: e.target.textContent } });
  // }

  // useEffect(e => {
  // 	if ((!teacherID || teacherID === 'undefined') && !id || !values?.find(value => value.id === +id))
  // 		navigate(`./${values?.[0].id}/${teacherID || isTeacher ? teacherID : teachers?.[0].id}`, { replace: true });
  // }, [teacherID, id]);

  return (
    <div className={presContainer}>
      <header>
        <h1>Админ</h1>

        <div>
          <div>
            <button className={styles.name} onClick={e => open ? setIsOpened(false) : setIsOpened(true)}>
              Admin
            </button>

            {open && (
              <Popup
              // userInfo={userInfo}
              // userName={userData?.name}
              // setIsOpen={setIsOpened}
              // isTeacher={isTeacher}
              // exit={exit}
              />
            )}
          </div>

          <motion.button className={styles.button} whileTap={{ scaleX: .85, scaleY: .95 }} onClick={exit}><img src="/logout.png" alt="..." /></motion.button>
        </div>
      </header>

      <div>
        <AsideBar
        // values={values}
        // saveItem={saveItem}
        // teacherID={teacherID}
        // isTeacher={isTeacher}
        // isLoading={isLoading}
        // isEditable={isEditable}
        // setIsEditable={setIsEditable}
        >
          <motion.button whileTap={{ scale: .9 }} onClick={addItemAPI}>+</motion.button>
        </AsideBar>
        <div className={editor}>
          <FormAdmin />

          <AsideBar
          // index={+id}
          // values={teachers}
          // saveItem={saveItem}
          // isTeacher={isTeacher}
          // isEditable={isEditable}
          // setIsEditable={setIsEditable}
          // isLoading={isTeachersLoading}
          >
            <motion.button whileTap={{ scale: .9 }} onClick={addItemAPI}>+</motion.button>
          </AsideBar>
        </div>
      </div>
    </div>
  )
}

export default Admin