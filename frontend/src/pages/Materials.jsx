import React, { useEffect, useMemo, useRef, useState } from 'react'
import { editor, textEditor, presContainer } from 'styles/presStyle.module.css'
import { motion } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import TextEditor from 'src/Layouts/TextEditor'
import { useMutation } from '@tanstack/react-query'
import AsideBar from 'src/Layouts/AsideBar'
import TextEditorTools from 'src/Layouts/TextEditorTools'
import styles from 'styles/presStyle.module.css';
import Popup from 'components/Popup'

const Materials = ({ setUserInfo, userInfo }) => {
	const textEditorRef = useRef();
	const queryClient = useQueryClient();
	const { id, teacherID } = useParams();
	const [isEditable, setIsEditable] = useState(false);
	const isTeacher = useMemo(e => userInfo.type === 'teachers', [userInfo.type]);
	const [fontSize, setFontSize] = useState('');
	const navigate = useNavigate();
	const [open, setIsOpened] = useState(false);

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
	const { data: teachers, isLoading: isTeachersLoading } = useQuery({
		queryKey: ['teachers'],
		queryFn: e => axios.get('/api/teachers')
			.then(data => {
				if (!teacherID)
					navigate(`/${data.data[0].id}/${data.data[0].id}`, { replace: true });

				return data.data
			}),
		enabled: !isTeacher
	});
	const { data: values, isLoading } = useQuery({
		queryKey: ['teachersMaterials', isTeacher ? userInfo.id : teacherID],
		queryFn: e => axios.get(`/api/teachersMaterials?teacherID=${isTeacher ? userInfo.id : teacherID}`)
			.then(data => {
				if (!isTeacher)
					navigate(`/${data.data[0].id}/${teacherID}`, { replace: true });

				if (values && values.length !== data.data.length)
					navigate(`/${data.data[data.data.length - 1].id}/${teacherID}`, { replace: true });

				return data.data;
			}
			),
		enabled: isTeacher || !!teachers
	});
	const { data: text, isLoading: isTextLoading, isFetching } = useQuery({
		queryKey: ['text', id, isTeacher ? userInfo.id : teacherID],
		queryFn: e => axios.get(`/api/text/${id}?teacherID=${isTeacher ? userInfo.id : teacherID}`)
			.then(data => {
				return data.data.text;
			}),
		enabled: !!values
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

	const { mutate: addItemAPI } = useMutation({
		mutationFn: async data => await axios.post(`/api/teachersMaterials?teacherID=${userInfo.id}`, { id: Date.now(), value: '' }),
		onSuccess: res => {
			queryClient.invalidateQueries(['teachersMaterials', isTeacher ? userInfo.id : teacherID]);
		},
		onError: res => { },
		retry: 3
	});
	const { mutate: setItemAPI } = useMutation({
		mutationFn: async data => await axios.post(`/api/teachersMaterials/${data.id}?teacherID=${userInfo.id}`, data.value),
		onMutate: res => {
			setIsEditable(false);
		},
		onSuccess: res => {
			queryClient.invalidateQueries(['teachersMaterials']);
		},
		onError: res => { }
	});
	const { mutate: deleteItemAPI } = useMutation({
		mutationFn: async data => {
			return await axios.delete(`/api/teachersMaterials/${id}?teacherID=${userInfo.id}`).then(data => data)
		},
		onSuccess: res => {
			queryClient.invalidateQueries(['teachersMaterials', isTeacher ? userInfo.id : teacherID])
		},
		onError: res => { },
		retry: 3
	});
	const { mutate: setTextAPI, isPending } = useMutation({
		mutationKey: ["text", id, isTeacher ? userInfo.id : teacherID],
		mutationFn: data => {
			return axios.post(`/api/text/${id}?teacherID=${isTeacher ? userInfo.id : teacherID}`, { text: textEditorRef.current.innerHTML }).then(data => data);
		},
		onSuccess: res => {
			queryClient.invalidateQueries(['text', res.id, isTeacher ? userInfo.id : teacherID]);
		},
		retry: 3
	});

	const exit = () => {
		setUserInfo('');

		localStorage.setItem('info', '');
		navigate('')
	}

	const saveItem = (e, id) => {
		const data = values.find(data => data.id === +id);

		setItemAPI({ id: id, value: { ...data, value: e.target.textContent } });
	}


	const buttonSrcs = useMemo(e => [
		{
			src: '/heading.png',
			text: 'Заголовок',
			onClick: e => {
				document.execCommand('formatBlock', false, 'h1');
			}
		},
		{
			src: '/text.png',
			text: 'Текст',
			onClick: e => {
				document.execCommand('formatBlock', false, 'p');
			}
		},
		{
			src: '/cursive.png',
			text: 'Курсив',
			onClick: e => {
				document.execCommand('Italic');
			}
		},
		{
			src: '/underline.png',
			text: 'Подчеркивание',
			onClick: e => {
				document.execCommand('underline');
			}
		},
		{
			src: '/save.png',
			text: isPending ? 'Сохраняется' : 'Сохранить',
			style: {
				background: '#dae1ea',
				color: '#dae1ea'
			},
			onClick: e => setTextAPI()
		},
		{
			src: '/delete.png',
			onClick: e => deleteItemAPI()
		}
	], [id, isPending]);

	useEffect(e => {
		if ((!teacherID || teacherID === 'undefined') && !id || !values?.find(value => value.id === +id))
			navigate(`./${values?.[0].id}/${teacherID || isTeacher ? teacherID : teachers[0].id}`, { replace: true });
	}, [teacherID, id]);

	return (
		<div className={presContainer}>
			<header>
				<h1>Материал для обучения</h1>

				<div>
					<div>
						<button className={styles.name} onClick={e => open ? setIsOpened(false) : setIsOpened(true)}>
							{userData.data?.name}
						</button>

						{ open && (
							<Popup userInfo={userInfo} userName={userData.data?.name} setIsOpen={setIsOpened} />
						)}
					</div>

					<motion.button whileTap={{ scaleX: .85, scaleY: .95 }} onClick={exit}><img src="/logout.png" alt="..." /></motion.button>
				</div>
			</header>

			<div>
				<AsideBar
					values={values}
					saveItem={saveItem}
					teacherID={teacherID}
					isTeacher={isTeacher}
					isLoading={isLoading}
					isEditable={isEditable}
					setIsEditable={setIsEditable}
				>
					{isTeacher && (
						<motion.button whileTap={{ scale: .9 }} onClick={addItemAPI}>+</motion.button>
					)}
				</AsideBar>
				<div className={editor}>
					<TextEditor
						key={text}
						text={text}
						userInfo={userInfo}
						itsRef={textEditorRef}
						className={textEditor}
						isLoading={isTextLoading}
						isEditable={isTeacher}
					/>

					{isTeacher ? (
						<TextEditorTools
							inputs={inputs}
							fontSize={fontSize}
							isPending={isPending}
							buttonSrcs={buttonSrcs}
							setFontSize={setFontSize}
							positionBtns={positionBtns}
						/>
					) : (
						<AsideBar
							index={+id}
							values={teachers}
							saveItem={saveItem}
							isTeacher={isTeacher}
							isEditable={isEditable}
							setIsEditable={setIsEditable}
							isLoading={isTeachersLoading}
						/>
					)}
				</div>
			</div>
		</div>
	)
}

export default Materials