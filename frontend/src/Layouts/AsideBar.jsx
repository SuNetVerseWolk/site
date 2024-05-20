import Item from 'components/Item'
import { motion } from 'framer-motion'
import React from 'react'
import { asideBar, warn } from 'styles/asideBar.module.css'

const AsideBar = ({
	index,
	values,
	children,
	saveItem,
	teacherID,
	isTeacher,
	isLoading,
	isEditable,
	setIsEditable,
}) => {
	return (
		<motion.div className={asideBar}>
			{
				isLoading ? (
					<div className={warn}>Загрузка...</div>
				) : (
					values?.length ? (
						values.map((item) => (
							<Item
								key={item.id}
								index={index || item.id}
								teacherID={teacherID || item.id}
								saveChanges={saveItem}
								isEditable={isEditable}
								setIsEditable={setIsEditable}
								mayEdite={isTeacher}
							>
								{item.value || item.name}
							</Item>
						))
					) : (
						<motion.div whileInView={{ scale: 1 }} initial={{ scale: .9 }} className={warn}>Пусто</motion.div>
					)
				)
			}

			{children}
		</motion.div>
	)
}

export default AsideBar
