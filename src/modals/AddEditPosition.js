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
    { id: 0, title: 'грамм', nick: 'г'},
    { id: 1, title: 'литр', nick: 'л'},
    { id: 2, title: 'миллиграмм', nick: 'мг'},
    { id: 3, title: 'миллилитр', nick: 'мл' },
]

const AddEditPosition = ({ id, position, editMode }) => {
    const router = useRouter();

    const group = {
        id: 1,
        vkGroupId: 666,
        Categories: [
            {
                id: 1,
                title: "Суп",
            },
            {
                id: 2,
                title: "Сок",
            },
            {
                id: 3,
                title: "Пиво",
            }
        ]
    };

    const [title, setTitle] = useState(!editMode ? '' : position.title);
    const [description, setDescription] = useState(!editMode ? '' : position.description);
    const [value, setValue] = useState(!editMode ? '' : position.value);
    const [unitId, setUnit] = useState(!editMode ? units[0].id : position.unitId);
    const [price, setPrice] = useState(!editMode ? '' : position.price);
    const [categoryId, setCategory] = useState(!editMode ? group.Categories[0].id : position.categoryId);
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

    const submitHandler = (event) => {
        event.preventDefault();	
        console.log(categoryId);
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

        // console.log(`
        //     title: ${title},
        //     description: ${description},
        //     value: ${value},
        //     unitId: ${unitId},
        //     price: ${price},
        //     categoryId: ${categoryId},
        //     image: ${image.src}
        // `);

        
    }

    return (
        <ModalPage id={id} 
            settlingHeight={100}
            onClose={() => router.popPage()}
        >
            <ModalPageHeader left={<PanelHeaderClose onClick={() => router.popPage()}/>}>
                {!editMode ? 'Добавление' : 'Редактирование'}
            </ModalPageHeader>
            <FormLayout id='position' onSubmit={e => submitHandler(e)}>
                <FormItem top="Название"
                    status={inputStatus.title ? inputStatus.title: 'default'}
                >
                    <Input name="title"
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
                    status={inputStatus.description ? inputStatus.description: 'default'}
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
                        status={inputStatus.value ? inputStatus.value: 'default'}
                    > 
                        <Input name="value"
                            type="text"
                            value={value}
                            placeholder="Введите размер"
                            onChange={e => { 
                                setInputStatus({});
                                setValue(e.target.value.replace(/[^\,0-9]/, ''));
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
                    status={inputStatus.price ? inputStatus.price: 'default'}
                >
                    <Input type="text"
                        name="price"
                        value={price}
                        placeholder="Введите цену"
                        onChange={e => { 
                            setInputStatus({});
                            setPrice(e.target.value.replace(/[^\,0-9]/, ''));
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
            <Separator wide={true}/>
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