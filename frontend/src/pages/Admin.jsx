import React, { useEffect, useMemo, useRef, useState } from 'react'
import { editor, textEditor, presContainer } from 'styles/presStyle.module.css'
import { motion } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import AsideBar from 'src/Layouts/AsideBar'
import styles from 'styles/presStyle.module.css';
import FormAdmin from 'components/FormAdmin'

const Admin = ({ setUserInfo }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDeleted, setIsDeleted] = useState(false);

  
  const getCurrentType = e => {
    const student = students?.find(user => user?.id === +id);

    if (student) return 'students';
    
    const teacher = teachers?.find(user => user?.id === +id);

    if (teacher) return 'teachers';
  }
  const { data: teachers, isLoading: isTeachersLoading } = useQuery({
  	queryKey: ['teachers'],
  	queryFn: e => axios.get('/api/teachers').then(data => {
      if (!isDeleted && teachers && teachers.length !== data.data.length)
        navigate(`/${data.data[data.data.length - 1].id}/${data.data[data.data.length - 1].id}`, { replace: true });

      if (isDeleted && getCurrentType() === 'teachers') {
        setIsDeleted(false);
        const i = teachers.findIndex(user => user.id === +id);

        navigate(`/${data.data?.[i > data.data.length - 1 ? 0 : i].id}/${data.data?.[i > data.data.length - 1 ? 0 : i].id}`);
      }

      return data.data
    })
  });
  const { data: students, isLoading } = useQuery({
  	queryKey: ['students'],
  	queryFn: e => axios.get(`/api/students`).then(data => {
      if (!isDeleted && students && students.length !== data.data.length)
        navigate(`/${data.data[data.data.length - 1].id}/${data.data[data.data.length - 1].id}`, { replace: true });
      
      if (isDeleted && getCurrentType() === 'students') {
        setIsDeleted(false);
        const i = students.findIndex(user => user.id === +id);

        navigate(`/${data.data?.[i > data.data.length - 1 ? 0 : i].id}/${data.data?.[i > data.data.length - 1 ? 0 : i].id}`);
      }

      return data.data
    })
  });

  const { mutate: addUserAPI } = useMutation({
    mutationFn: async data => await axios.post(`/api/users?key=${import.meta.env.VITE_ADMIN_ID}`, data),
    onSuccess: res => {
      queryClient.invalidateQueries([res.data.type]);
    },
    onError: res => { },
    retry: 3
  });

  const exit = () => {
    setUserInfo('');

    localStorage.removeItem('info', '');
    navigate('');
  }

  useEffect(e => {
    if (!id && students?.[0].id)
      return navigate(`${students?.[0].id}/${students?.[0].id}`);
  }, [id, students, teachers]);

  return (
    <div className={presContainer}>
      <header>
        <h1>Админ</h1>

        <div>
          <div>
            <button className={styles.name}>
              Admin
            </button>
          </div>

          <motion.button className={styles.button} whileTap={{ scaleX: .85, scaleY: .95 }} onClick={exit}><img src="/logout.png" alt="..." /></motion.button>
        </div>
      </header>

      <div>
        <AsideBar
          text={'Студенты'}
          values={students}
          isTeacher={true}
          isLoading={isLoading}
        >
          <motion.button whileTap={{ scale: .9 }} onClick={e => addUserAPI({ type: 'students' })}>+</motion.button>
        </AsideBar>
        <div className={editor}>
          <FormAdmin setIsDeleted={setIsDeleted} user={students?.find(user => user?.id === +id) || teachers?.find(user => user?.id === +id)}/>

          <AsideBar
            text={'Преподователи'}
            values={teachers}
            isTeacher={true}
            isLoading={isTeachersLoading}
          >
            <motion.button whileTap={{ scale: .9 }} onClick={e => addUserAPI({ type: 'teachers' })}>+</motion.button>
          </AsideBar>
        </div>
      </div>
    </div>
  )
}

export default Admin