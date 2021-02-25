import React, { useState } from 'react';
import cloneDeep from 'lodash-es/cloneDeep';
import Resizer from 'react-image-file-resizer';
// import cloneDeep from 'lodash-es/cloneDeep';
import {
	ModalPage,
	ModalPageHeader,
	PanelHeaderClose,
	Input,
	FixedLayout,
	Div,
	Button,
	Separator,
	NativeSelect,
	FormLayout,
	FormItem,
	FormLayoutGroup,
	Textarea,
	RichCell,
	File,
	Avatar
} from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';
import { Icon56GalleryOutline } from '@vkontakte/icons';

import API from '../utils/API';
import { PAGE_FILL_MENU } from '../router';


const units = [
	{ id: 0, title: 'грамм', nick: 'г' },
	{ id: 1, title: 'литр', nick: 'л' },
	{ id: 2, title: 'миллиграмм', nick: 'мг' },
	{ id: 3, title: 'миллилитр', nick: 'мл' },
]

const AddEditPosition = ({ id, group, setGroup, position, editMode }) => {
	const router = useRouter();

	const [title, setTitle] = useState(!editMode ? '' : position.title);
	const [description, setDescription] = useState(!editMode ? '' : position.description);
	const [value, setValue] = useState(!editMode ? '' : position.value);
	const [unitId, setUnit] = useState(!editMode ? units[0].id : position.unitId);
	const [price, setPrice] = useState(!editMode ? '' : position.price);
	const [categoryId, setCategory] = useState(position.categoryId);
	const [image, setImage] = useState({ plug: <Icon56GalleryOutline />, src: '', file: false });

	const [inputMes, setInputMes] = useState({});
	const [inputStatus, setInputStatus] = useState({});

	const imageSelectHandle = (event) => {
		event.nativeEvent.preventDefault();

		const resizeFile = (file) => new Promise(resolve => {
			Resizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
				uri => {
					resolve(uri);
				},
				'file',
				500,
				500
			);
		});

		if (!event.target.files[0]) return;

		const file = event.target.files[0];

		if (file.size > 5242880) {
			setInputMes({ image: 'Допустимый размер изображения не больше 5МБ.' });
			setInputStatus({ image: 'error' });
			return document.getElementsByClassName('ModalPage__content').scrollTop = Infinity;
		}

		let w, h, ratio;
		const img = new Image();
		img.onload = async function () {
			w = this.naturalWidth;
			h = this.naturalHeight;
			ratio = w / h;

			if (ratio < 0.99 || ratio > 1.01) {
				setInputMes({ image: 'Соотношение сторон загружаемого изображения не равно 1:1.' });
				setInputStatus({ image: 'error' });
				return document.getElementsByClassName('ModalPage__content').scrollTop = Infinity;
			}

			if (w > 700) {
				try {
					let newFile = await resizeFile(file);
					return setImage({ src: URL.createObjectURL(newFile), plug: null, file: newFile });
				} catch (error) {
					console.log(error);
				}
			}

			return setImage({ src: this.src, plug: null, file: false });
		}
		img.src = URL.createObjectURL(file);

	}

	const submitHandle = async (event) => {
		event.preventDefault();
		console.log('submit');
		switch (true) {
			case !title.trim():
				setInputStatus({ title: 'error' });
				return document.getElementsByClassName('ModalPage__content').scrollTop = 0;
			case !description.trim():
				return setInputStatus({ description: 'error' });
			case !value.trim():
				return setInputStatus({ value: 'error' });
			case !price.trim():
				return setInputStatus({ price: 'error' });
			case !image.src:
				setInputMes({ image: 'Загрузите изображение добавляемого блюда.' });
				setInputStatus({ image: 'error' });
				return document.getElementsByClassName('ModalPage__content').scrollTop = Infinity;
		}

		const formData = new FormData(document.getElementById('position'));

		if (image.file) {
			formData.set('image', image.file, image.file.name);
		}

		try {
			const response = await API.post('/positions', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
			console.log(response.data.position);
			let cloneGroup = cloneDeep(group);
			const catIndex = cloneGroup.catOrder.indexOf(categoryId);
			if (cloneGroup.Categories[catIndex].Positions === undefined) {
				cloneGroup.Categories[catIndex].Positions = [response.data.position];
			} else {
				cloneGroup.Categories[catIndex].Positions.push(response.data.position);
			}
			cloneGroup.Categories[catIndex].posOrder.push(response.data.position.id);
			setGroup(cloneGroup);
			return router.popPage();
		} catch (err) {
			console.log(err);
		}


	}

	return (
		<ModalPage id={id}
			settlingHeight={100}
			onClose={() => router.popPage()}
		>
			<ModalPageHeader left={<PanelHeaderClose onClick={() => router.popPage()} />}>
				{!editMode ? 'Добавление' : 'Редактирование'}
			</ModalPageHeader>
			<FormLayout id='position' onSubmit={submitHandle}>
				<FormItem top="Название"
					status={inputStatus.title ? inputStatus.title : 'default'}
				>
					<Input name="title"
						form="position"
						type="text"
						value={title}
						maxLength="50"
						placeholder="Введите название"
						onChange={e => {
							setInputStatus({});
							setTitle(e.target.value);
						}}
					/>
				</FormItem>
				<FormItem top="Описание"
					status={inputStatus.description ? inputStatus.description : 'default'}
				>
					<Textarea name="description"
						value={description}
						maxLength="100"
						placeholder="Введите описание"
						onChange={e => {
							setInputStatus({});
							setDescription(e.target.value);
						}}
					/>
				</FormItem>
				<FormLayoutGroup mode="horizontal">
					<FormItem top="Размер порции"
						status={inputStatus.value ? inputStatus.value : 'default'}
					>
						<Input name="value"
							type="number"
							step='0.5'
							value={value}
							placeholder="Введите размер"
							onChange={e => {
								setInputStatus({});
								setValue(e.target.value);
							}}
						/>
					</FormItem>
					<FormItem>
						<NativeSelect name="unitId"
							value={unitId}
							onChange={e => setUnit(e.currentTarget.value)}
						>
							{units.map(unit => {
								return <option key={unit.id} value={unit.id}>{unit.title}</option>
							})}
						</NativeSelect>
					</FormItem>
				</FormLayoutGroup>
				<FormItem top="Цена, ₽"
					status={inputStatus.price ? inputStatus.price : 'default'}
				>
					<Input type="number"
						step="0.5"
						name="price"
						value={price}
						placeholder="Введите цену"
						onChange={e => {
							setInputStatus({});
							setPrice(e.target.value);
						}}

					/>
				</FormItem>
				<FormItem top="Категория">
					<NativeSelect name="categoryId"
						value={categoryId}
						onChange={e => setCategory(e.currentTarget.value)}
					>
						{group.Categories && group.Categories.map(category => {
							return <option key={category.id} value={category.id}>{category.title}</option>
						})}
					</NativeSelect>
				</FormItem>
				<FormItem top="Изображение"
					status={inputStatus.image ? inputStatus.image : 'default'}
					bottom={inputMes.image ? inputMes.image : null}
				>
					<RichCell
						disabled
						multiline
						before={
							<Avatar size={100} mode='app' id='preview' src={image.src}>
								{image.plug}
							</Avatar>
						}
						caption="Загрузите изображение блюда. Рекомендуемый размер 500×500px"
						actions={
							<React.Fragment>
								<File mode="secondary"
									name='image'
									accept=".png, .jpg, .jpeg"
									onChange={e => {
										setImage({ plug: <Icon56GalleryOutline />, src: '', file: false });
										setInputStatus({});
										setInputMes({});
										imageSelectHandle(e);
									}}
								>
									Загрузить изображение
                                </File>
							</React.Fragment>
						}
					/>
				</FormItem>
			</FormLayout>
			<Separator wide={true} />
			<Div>
				<Button size='l' type='submit' form='position' stretched>
					Добавить позицию
                    </Button>
			</Div>
			{/* <FixedLayout vertical='bottom'>
                
            </FixedLayout> */}
		</ModalPage>
	);
};

export default AddEditPosition;