import React, { useRef, useState } from 'react'
import axios from 'axios';
import { popup, button, deleteButton } from 'styles/popup.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion'
import deleteImg from '/delete.png'

const Popup = ({ userInfo, userName, setIsOpen, isTeacher, exit }) => {
	const popupForm = useRef();
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: async data => await axios.post(`/api/user/change?id=${userInfo.id}&type=${userInfo.type}`, data),
		onSuccess: res => {
			queryClient.invalidateQueries([userInfo.type, userInfo.id]);
			setIsOpen(false);
		},
		onError: res => { },
		retry: 3
	});
	const { mutate: deleteUser } = useMutation({
		mutationFn: async data => await axios.delete(`/api/students/${userInfo.id}`),
		onSuccess: res => {
			setIsOpen(false);
			exit();
		},
		onError: res => { },
		retry: 3
	});
	const [name, setName] = useState(userName);

	const getPopupFormData = e => Object.fromEntries(new FormData(popupForm.current).entries())

	return (
		<motion.form
			ref={popupForm}
			className={popup}
			initial={{ scale: .80 }}
			animate={{ scale: 1 }}
			onSubmit={e => e.preventDefault()}
		>
			<input id='name' name='name' type="text" value={name} onChange={e => setName(e.target.value)} />
			<input id='password' name='password' type="text" />

			<div className={button}>
				<motion.button
					whileTap={{ scaleX: .85, scaleY: .95 }}

					onClick={e => mutate(getPopupFormData())}
				>
					Изменить
				</motion.button>
				{!isTeacher && (
					<motion.button
						className={deleteButton}
						whileTap={{ scaleX: .85, scaleY: .95 }}

						onClick={e => deleteUser()}
					>
						<img src={deleteImg} alt="Удалить акаунт" />
					</motion.button>
				)}
			</div>
		</motion.form>
	)
}

export default Popup