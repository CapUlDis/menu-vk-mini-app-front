import React from 'react';
import _ from 'lodash';
import bridge from "@vkontakte/vk-bridge";
import { Panel, Placeholder, Title, FixedLayout, Div, Button } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';

import API from '../utils/API';
import { PANEL_START, PAGE_PRESET } from '../router';
import menu from './components/img/menu.svg';


const Start = ({ id, setGroup }) => {
  const router = useRouter();

  const addMenuToCommunity = async () => {
    try {
      const responseVk = await bridge.send("VKWebAppAddToCommunity");
      const response = await API.post('/groups', { vkGroupId: responseVk.group_id });
      setGroup(response.data.group);
      return router.pushPage(PAGE_PRESET);
    } catch (err) {
      console.log(err);
      return;
    }

  }

  return (
    <Panel id={id}>
      <Placeholder
        icon={<img src={menu} />}
        // header={<Title level='1'>Меню <br/>заведения</Title>}
        header='Меню заведения'
        stretched
      >
        Описание приложения. <br />Выберите категории, которые представлены в вашем заведении. Позже вы сможете их изменить или создать новые.
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