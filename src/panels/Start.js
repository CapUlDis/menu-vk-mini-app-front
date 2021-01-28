import React from 'react';
import _ from 'lodash';
import bridge from "@vkontakte/vk-bridge";
import { Panel, Placeholder, Title, FixedLayout, Div, Button } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';
import { PANEL_START, PAGE_PRESET } from '../router';
import menu from './components/img/menu.svg';


const Start = ({ id, menuInfo, setMenuInfo }) => {
    const router = useRouter();

    const addMenuToCommunity = async () => {
        try {
            const response = await bridge.send("VKWebAppAddToCommunity");
            const cloneMenuInfo = _.cloneDeep(menuInfo);
            cloneMenuInfo.groupID = response.group_id;
            setMenuInfo(cloneMenuInfo);
            return router.pushPage(PAGE_PRESET);
        } catch(e) {
            console.log(e);
            return;
        }
        
    }

    return (
        <Panel id={id}>
            <Placeholder
                icon={<img src={menu}/>}
                // header={<Title level='1'>Меню <br/>заведения</Title>}
                header='Меню заведения'
                stretched
            >
                Описание приложения. <br/>Выберите категории, которые представлены в вашем заведении. Позже вы сможете их изменить или создать новые.
            </Placeholder>
            <FixedLayout vertical='bottom'>
                <Div>
                    <Button size='l' stretched onClick={addMenuToCommunity}>
                        Установить в сообщество
                    </Button>
                </Div>
            </FixedLayout>
        </Panel>
    )
};

export default Start;