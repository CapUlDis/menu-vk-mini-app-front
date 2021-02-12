import React, { useState } from 'react';
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

import API from '../utils/API';
import { PAGE_FILL_MENU } from '../router';


const units = [
    { title: 'грамм', nick: 'г'},
    { title: 'литр', nick: 'л'},
    { title: 'миллиграмм', nick: 'мг'},
    { title: 'миллилитр', nick: 'мл' },
]

const AddEditPosition = ({ id }) => {
    const router = useRouter();

    return (
        <ModalPage id={id} 
            settlingHeight={100}
            onClose={() => router.popPage()}
        >
            <ModalPageHeader left={<PanelHeaderClose onClick={() => router.popPage()}/>}>
                Добавление
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
                        <NativeSelect>
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
                <FormItem top="Изображение">
                    <RichCell
                        disabled
                        before={<Avatar size={100} mode='app'/>}
                        caption="Команда ВКонтакте, Санкт-Петербург"
                        actions={
                            <React.Fragment>
                                <File/>
                            </React.Fragment>
                        }
                    />
                </FormItem>
            </FormLayout>
            <FixedLayout vertical='bottom'>
                <Separator wide={true}/>
                <Div>
                    <Button size='l' stretched>
                        Добавить позицию
                    </Button>
                </Div>
            </FixedLayout>
        </ModalPage>
    );
};

export default AddEditPosition;