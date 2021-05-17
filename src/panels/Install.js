import React, { useState } from 'react';
import bridge from "@vkontakte/vk-bridge";
import { Panel, Placeholder, FixedLayout, Div, Button, Link } from '@vkontakte/vkui';

import SnackbarError from '../popouts/SnackbarError';
import menuMob from './components/img/menu_mob.png';
import menuDes from './components/img/menu_des.png';
import './Install.css';


const Install = ({ id, desktop }) => {
  const [snackbarError, setSnackbarError] = useState(null);
  const [link, setLink] = useState(false);

  const addMenuToCommunity = async () => {
    try {
      const response = await bridge.send("VKWebAppAddToCommunity");

      return setLink(`https://vk.com/public${response.group_id}`);
    } catch (err) {
      if (err.error_data && err.error_data.error_code === 1) {
        setSnackbarError(
          <SnackbarError setSnackbarError={setSnackbarError}>
            Проблемы с получением данных от сервера. Проверьте интернет-соединение.
          </SnackbarError>
        );
      }

      return;
    }

  }

  return (
    <Panel id={id}>
      <div className="placeholder">
        <Placeholder 
          icon={<img src={desktop ? menuDes : menuMob} width={desktop ? 64 : 88} height={desktop ? 64 : 88}/>}
          header='Меню заведения'
          action={desktop && <Button size="l" onClick={addMenuToCommunity}>Установить в сообщество</Button>}
        >
          <p className="placeholder__text">Описание приложения. <br />Выберите категории, которые представлены в вашем заведении. Позже вы сможете их изменить или создать новые.</p>
        </Placeholder>
        {link &&
          <Div className="link">
            <Link href={link} target="_blank">Перейти в сообщество для запуска приложения</Link>
          </Div>
        }
      </div>
      {!desktop &&
        <FixedLayout vertical='bottom'>
          <Div>
            <Button size='l' stretched onClick={addMenuToCommunity}>
              Установить в сообщество
            </Button>
          </Div>
        </FixedLayout>
      }
      {snackbarError}
    </Panel>
  )
};

export default Install;