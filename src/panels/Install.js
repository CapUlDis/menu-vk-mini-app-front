import React from 'react';
import bridge from "@vkontakte/vk-bridge";
import { Panel, Placeholder, FixedLayout, Div, Button } from '@vkontakte/vkui';

import menu from './components/img/menu.svg';
import './Install.css';


const Install = ({ id, desktop }) => {

  const addMenuToCommunity = async () => {
    try {
      await bridge.send("VKWebAppAddToCommunity");
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

export default Install;