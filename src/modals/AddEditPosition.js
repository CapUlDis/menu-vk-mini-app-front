import React, { useState } from 'react';
import cloneDeep from 'lodash-es/cloneDeep';
import Resizer from 'react-image-file-resizer';
import {
	ModalPage,
	ModalPageHeader,
	PanelHeaderClose,
	Input,
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
	Avatar,
  CellButton,
} from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';
import { Icon56GalleryOutline, Icon28DeleteOutline, Icon24DeleteOutline, Icon24DismissOverlay } from '@vkontakte/icons';

import API from '../utils/API';
import SnackbarError from '../popouts/SnackbarError';
import units from '../utils/units';
import './AddEditPosition.css';
import { POPOUT_ALERT_DELETE_POSITION } from '../router';


const AddEditPosition = ({ id, desktop, group, setGroup, position, editMode, setEditMode, abortHandle }) => {
	const router = useRouter();

	const [title, setTitle] = useState(!editMode ? '' : position.title);
	const [description, setDescription] = useState(!editMode ? '' : position.description);
	const [value, setValue] = useState(!editMode ? '' : position.value);
	const [unitId, setUnit] = useState(!editMode ? units[0].id : position.unitId);
	const [price, setPrice] = useState(!editMode ? '' : position.price);
	const [categoryId, setCategory] = useState(position.categoryId);
  const [submitDisable, setSubmitDisable] = useState(false);
	const [image, setImage] = useState({ 
    plug: !editMode 
      ? <Icon56GalleryOutline/> 
      : position.imageUrl
        ? null
        : <Icon56GalleryOutline/>, 
    src: !editMode 
      ? '' 
      : position.imageUrl 
        ? position.imageUrl
        : '', 
    file: false 
  });

	const [inputMes, setInputMes] = useState({});
	const [inputStatus, setInputStatus] = useState({});
  const [snackbarError, setSnackbarError] = useState(null);


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
    setSubmitDisable(true);
    setTimeout(() => setSubmitDisable(false), 500);

		switch (true) {
			case !title.trim():
				setInputStatus({ title: 'error' });
				return document.getElementsByClassName('ModalPage__content').scrollTop = 0;
			case !description.trim():
				return setInputStatus({ description: 'error' });
			case !value:
				return setInputStatus({ value: 'error' });
			case !price:
				return setInputStatus({ price: 'error' });
		}

		const formData = new FormData(document.getElementById('position'));
    console.log(image, formData.get('image'));

		if (image.file) {
			formData.set('image', image.file, image.file.name);
		} else {
      formData.delete('image');
    }

		try {
      let cloneGroup = cloneDeep(group);

      if (editMode) {

        if (!image.src) {
          formData.set('imageId', null);
        }

        const response = await API.patch(`/positions/${position.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
        let cloneGroup = cloneDeep(group);
        
        const catIndex = cloneGroup.catOrder.indexOf(parseInt(position.categoryId));
        const posIndex = cloneGroup.Categories[catIndex].posOrder.indexOf(position.id);

        if (position.categoryId !== categoryId) {
          const newCatIndex = cloneGroup.catOrder.indexOf(categoryId);

          cloneGroup.Categories[catIndex].posOrder.splice(posIndex, 1);
          cloneGroup.Categories[catIndex].Positions.splice(posIndex, 1);
          cloneGroup.Categories[newCatIndex].posOrder.push(position.id);

          if (cloneGroup.Categories[newCatIndex].Positions === undefined) {
            cloneGroup.Categories[newCatIndex].Positions = [response.data.position];
          } else {
            cloneGroup.Categories[newCatIndex].Positions.push(response.data.position);
          }
        } else {
          cloneGroup.Categories[catIndex].Positions[posIndex] = response.data.position;
        }

        setGroup(cloneGroup);
        router.popPage();
        return setTimeout(() => setEditMode(false), 1000);
      }
			
      const response = await API.post('/positions', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
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

      return setSnackbarError(
        <SnackbarError setSnackbarError={setSnackbarError}>
          Проблемы с получением данных от сервера. Проверьте интернет-соединение.
        </SnackbarError>
      );
		}
	}

	return (
		<ModalPage id={id}
			settlingHeight={100}
			onClose={abortHandle}
      header={
        <ModalPageHeader left={!desktop && <PanelHeaderClose onClick={abortHandle} />}>
          {!editMode ? 'Добавление' : 'Редактирование'}
        </ModalPageHeader>
      }
		>
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
					<Textarea className={desktop ? "textarea_desktop" : "textarea_mobile"}
            name="description"
            grow={true}
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
              maxLength='5'
              min="0"
							type="number"
							step='0.5'
							value={value}
							placeholder="Введите размер"
							onChange={e => {
								setInputStatus({});

                if (e.target.value.length > e.target.maxLength) {
                  return setValue(e.target.value.slice(0, e.target.maxLength));
                }

								return setValue(e.target.value);
							}}
						/>
					</FormItem>
					<FormItem className="select-units"
            style={{ maxWidth: desktop ? '104px' : '120px' }}
          >
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
            maxLength='7'
						step="0.5"
            min="0"
						name="price"
						value={price}
						placeholder="Введите цену"
						onChange={e => {
							setInputStatus({});

              if (e.target.value.length > e.target.maxLength) {
                return setPrice(e.target.value.slice(0, e.target.maxLength));
              }

							setPrice(e.target.value);
						}}

					/>
				</FormItem>
				<FormItem top="Категория">
					<NativeSelect name="categoryId"
						value={categoryId}
						onChange={e => setCategory(parseInt(e.currentTarget.value))}
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
							<Avatar size={100} mode='image' shadow={false} id='preview' src={image.src}>
								{image.plug}
                {image.src && <Icon24DismissOverlay className="image-input__close" onClick={() => {
                  document.getElementById('fileInput').value = null;
                  setImage({ plug: <Icon56GalleryOutline/>, src: '', file: false });
                }} />}
							</Avatar>
						}
						caption="Загрузите изображение блюда. Рекомендуемый размер 500×500px"
						actions={
							<React.Fragment>
								<File id='fileInput'
                  mode="secondary"
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
      {editMode && !desktop &&
        <Div>
          <Separator wide={true}/>
          <CellButton before={<Icon28DeleteOutline/>} mode="danger" onClick={() => router.pushPopup(POPOUT_ALERT_DELETE_POSITION)}>
            Удалить позицию
          </CellButton>
        </Div>
      }
			<Separator wide={true}/>
			{desktop 
        ? <Div className="footer-desktop">
          {editMode &&
            <Button className="footer-desktop__left-button footer-desktop__left-button_red" 
              size="s" 
              mode="tertiary"
              before={<Icon24DeleteOutline/>} 
              onClick={() => router.pushPopup(POPOUT_ALERT_DELETE_POSITION)}
            >
              Удалить позицию
            </Button>
          }
          <Button className="footer-desktop__button" 
            size="s" 
            mode="secondary"
            onClick={abortHandle}
          >
            Отмена
          </Button>
          <Button className="footer-desktop__button footer-desktop__button_right"
            size='s'
            type='submit' 
            form='position'
            disabled={submitDisable}
          >
            {!editMode ? 'Добавить позицию' : 'Сохранить'}
          </Button>
        </Div>
        : <Div>
          <Button size='l'
            type='submit' 
            form='position'
            disabled={submitDisable}
            stretched
          >
            {!editMode ? 'Добавить позицию' : 'Сохранить'}
          </Button>
        </Div>
      }
      {snackbarError}
		</ModalPage>
	);
};

export default AddEditPosition;