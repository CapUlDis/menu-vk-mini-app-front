import React, { useState } from 'react';
import { Panel, PanelHeader, PanelHeaderButton, FixedLayout, Div, Group, Header, Link, Cell, CellButton, Avatar, Banner, usePlatform } from '@vkontakte/vkui';
import { Icon28EditOutline } from '@vkontakte/icons';
import { Icon24PenOutline } from '@vkontakte/icons';
import { Icon20Add } from '@vkontakte/icons';
import { Icon24ViewOutline } from '@vkontakte/icons';
import { Icon24MoreHorizontal } from '@vkontakte/icons';

import foodVk from './components/img/foodvk.svg';


const FillMenu = ({ id, desktop }) => {

    return (
        <Panel id={id}>
            <PanelHeader separator={false}
                left={!desktop && <PanelHeaderButton><Icon28EditOutline/></PanelHeaderButton>}
            >
                Ваше Меню 
            </PanelHeader>
            <Banner
                before={<img src={foodVk}/>}
                text='Добавьте ссылку на страницу заведения в Еде ВКонтакте'
            />
            <Group header={
                <Header mode="primary" 
                    indicator="0"
                    aside={<Link>{desktop ? 'Добавить блюдо' : <Icon20Add/>}</Link>}
                >
                    Завтрак
                </Header>
            }>
                <Cell draggable
                    before={<Avatar mode='app' />} 
                    indicator={<Icon24MoreHorizontal/>}
                    description='330 ₽'
                >
                    Смузи боул киви-шпинат
                </Cell>
                <Cell draggable
                    before={<Avatar mode='app' />} 
                    indicator={<Icon24MoreHorizontal/>}
                    description='330 ₽'
                >
                    Смузи боул киви-шпинат
                </Cell>
            </Group>
            <Group header={
                <Header mode="primary" 
                    indicator="0"
                    aside={<Link>{desktop ? 'Добавить блюдо' : <Icon20Add/>}</Link>}
                >
                    Завтрак
                </Header>
            }>
                <Cell draggable
                    before={<Avatar mode='app' />} 
                    after={<Icon24MoreHorizontal/>}
                    description='330 ₽'
                >
                    Смузи боул киви-шпинат
                </Cell>
                <Cell draggable
                    before={<Avatar mode='app' />} 
                    indicator={<Icon24MoreHorizontal style={{ marginRight: '5px' }}/>}
                    description='330 ₽'
                >
                    Смузи боул киви-шпинат
                </Cell>
            </Group>
            <FixedLayout vertical='bottom'>
                <Div>
                    {desktop && <CellButton before={<Icon24PenOutline/>}>Изменить категории</CellButton>}
                    <CellButton before={<Icon24ViewOutline/>}>Предпросмотр меню</CellButton>
                </Div>
            </FixedLayout>
        </Panel>
    );
};

export default FillMenu;
