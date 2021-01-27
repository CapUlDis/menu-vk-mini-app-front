import React from 'react';
import bridge from "@vkontakte/vk-bridge";
import { Panel, Placeholder, Title, FixedLayout, Button } from '@vkontakte/vkui';
import { PANEL_START } from '../router';
import menu from './img/menu.svg';


const Start = ({ id }) => {
    const addMenuToCommunity = async () => {
        await bridge.send("VKWebAppAddToCommunity").catch(() => null);
    }

    return (
        <Panel id={id}>
            <Placeholder
                icon={<img src={menu}/>}
                header={<Title level='1'>Меню <br/>заведения</Title>}
                stretched
            >
                Описание приложения. <br/>Выберите категории, которые представлены в вашем заведении. Позже вы сможете их изменить или создать новые.
            </Placeholder>
            <FixedLayout vertical='bottom'>
                <Button size='l' stretched onClick={addMenuToCommunity}>
                    Установить в сообщество
                </Button>
            </FixedLayout>
        </Panel>
    )
};

export default Start;