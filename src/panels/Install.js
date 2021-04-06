import React, { useState } from 'react';
import bridge from "@vkontakte/vk-bridge";
import { Panel, Placeholder, FixedLayout, Div, Button } from '@vkontakte/vkui';

import SnackbarError from '../popouts/SnackbarError';
import menu from './components/img/menu.svg';
import './Install.css';


const Install = ({ id, desktop }) => {
  const [snackbarError, setSnackbarError] = useState(null);

  const addMenuToCommunity = async () => {
    try {
      await bridge.send("VKWebAppAddToCommunity");

      return;
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
      <Placeholder
        icon={<img src={menu} />}
        header='Меню заведения'
        stretched
        action={desktop && <Button size="l" onClick={addMenuToCommunity}>Установить в сообщество</Button>}
      >
        <p className="placeholder__text">Описание приложения. <br />Выберите категории, которые представлены в вашем заведении. Позже вы сможете их изменить или создать новые.</p>
      </Placeholder>
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