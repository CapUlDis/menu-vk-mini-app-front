import React, { useState } from 'react';
import Resizer from 'react-image-file-resizer';
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
    { title: 'грамм', nick: 'г'},
    { title: 'литр', nick: 'л'},
    { title: 'миллиграмм', nick: 'мг'},
    { title: 'миллилитр', nick: 'мл' },
]

const AddEditPosition = ({ id, position, editMode }) => {
    const router = useRouter();

    const [title, setTitle] = useState(!editMode ? '' : position.title);
    const [description, setDescription] = useState(!editMode ? '' : position.description);
    const [value, setValue] = useState(!editMode ? '' : position.value);
    const [unit, setUnit] = useState(!editMode ? '' : position.unit);
    const [image, setImage] = useState({ plug: <Icon56GalleryOutline/>, src: '' });
    
    const [inputMes, setInputMes] = useState({});
    const [inputStatus, setInputStatus] = useState({});

    const imageSelectHadler = (event) => {
        const resizeFile = (file) => new Promise(resolve => {
            Resizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0,
                uri => {
                    resolve(uri);
                },
                'base64',
                500,
                500
            );
        });

        if (!event.target.files[0]) return;
        
        if (event.target.files[0].size > 5242880) {
            setInputMes({ image: 'Допустимый размер изображения не больше 5МБ.' });
            setInputStatus({ image: 'error' });
            return document.getElementsByClassName('ModalPage__content').scrollTop = Infinity;
        }

        let w, h, ratio;
        const file = event.target.files[0];
        const img = new Image();
        img.onload = async function() {
            console.log('tut');
            w = this.naturalWidth;
            h = this.naturalHeight;
            ratio = w/h;

            if (ratio < 0.99 || ratio > 1.01) {
                setInputMes({ image: 'Соотношение сторон загружаемого изображения не равно 1:1.' });
                setInputStatus({ image: 'error' });
                return document.getElementsByClassName('ModalPage__content').scrollTop = Infinity;
            }

            if (w > 700) {
                try {
                    const image = await resizeFile(file);
                    this.src = image;
                } catch(error) {
                    console.log(error);
                }
            }
            setImage({ src: this.src, plug: null });
        }
        img.src = URL.createObjectURL(event.target.files[0]);
        
    }

    return (
        <ModalPage id={id} 
            settlingHeight={100}
            onClose={() => router.popPage()}
        >
            <ModalPageHeader left={<PanelHeaderClose onClick={() => router.popPage()}/>}>
                {!editMode ? 'Добавление' : 'Редактирование'}
            </ModalPageHeader>
            <FormLayout>
                <FormItem top="Название">
                    <Input type="text"
                        name="title"
                        placeholder="Введите название"
                    />
                </FormItem>
                <FormItem top="Описание">
                    <Textarea
                        name="description"
                        placeholder="Введите описание"
                    />
                </FormItem>
                <FormLayoutGroup mode="horizontal">
                    <FormItem top="Размер порции"> 
                        <Input type="text"
                            name="value"
                            placeholder="Введите размер"
                        />
                    </FormItem>
                    <FormItem>
                        <NativeSelect name="unit">
                            {units.map((unit, index) => {
                                return <option key={index} value={unit.nick}>{unit.title}</option>
                            })}
                        </NativeSelect>
                    </FormItem>
                </FormLayoutGroup>
                <FormItem top="Цена, ₽">
                    <Input type="text"
                        name="title"
                        placeholder="Введите название"
                    />
                </FormItem>
                <FormItem top="Категория">
                    <NativeSelect>
                        {units.map((unit, index) => {
                            return <option key={index} value={unit.nick}>{unit.title}</option>
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
                                    id="file"
                                    accept=".png, .jpg, .jpeg"
                                    onChange={(e) => {
                                        setImage({ plug: <Icon56GalleryOutline/>, src: '' });
                                        setInputStatus({});
                                        setInputMes({});
                                        imageSelectHadler(e);
                                    }}
                                >
                                    Загрузить изображение
                                </File>
                            </React.Fragment>
                        }
                    />
                </FormItem>
            </FormLayout>
            {/* <FixedLayout vertical='bottom'>
                <Separator wide={true}/>
                <Div>
                    <Button size='l' stretched>
                        Добавить позицию
                    </Button>
                </Div>
            </FixedLayout> */}
        </ModalPage>
    );
};

export default AddEditPosition;