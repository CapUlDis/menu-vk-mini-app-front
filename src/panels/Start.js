import React from 'react';
import bridge from "@vkontakte/vk-bridge";
import { Panel, Placeholder, FixedLayout, Div, Button } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';

import API from '../utils/API';
import { PAGE_PRESET } from '../router';
import menu from './components/img/menu.svg';
import './Start.css';


const Start = ({ id, setGroup, desktop, fetchGroupInfo, setAdmin }) => {
  const router = useRouter();

  const addMenuToCommunity = async () => {
    try {
      const responseVk = await bridge.send("VKWebAppAddToCommunity");
      const response = await API.post('/groups', { vkGroupId: responseVk.group_id });

      setGroup(response.data.group);
      setAdmin(true);

      fetchGroupInfo(response.data.group);

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
        header='Меню заведения'
        stretched
        action={desktop && <Button size="m" onClick={addMenuToCommunity}>Установить в сообщество</Button>}
      >
        <p className="placeholder__text">Описание приложения. <br />Выберите категории, которые представлены в вашем заведении. Позже вы сможете их изменить или создать новые.</p>
      </Placeholder>
      <FixedLayout vertical='bottom'>
        {!desktop &&
          <Div>
            <Button size='l' stretched onClick={addMenuToCommunity}>
              Установить в сообщество
            </Button>
          </Div>
        }
      </FixedLayout>
    </Panel>
  )
};

export default Start;