import React from 'react';
import { Alert } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';

import { enableScroll } from '../utils/bodyScroll';
import { PANEL_FILL_MENU } from '../router';

const AlertDeletePosition = ({ deletePosition }) => {
  const router = useRouter();

  return (
    <Alert
      actions={[{
        title: 'Отмена',
        autoclose: true,
        mode: 'cancel'
      }, {
        title: 'Удалить',
        autoclose: true,
        mode: 'destructive',
        action: deletePosition,
      }]}
      actionsLayout="horizontal"
      onClose={() => {
        enableScroll(PANEL_FILL_MENU);
        router.popPage();
      }}
      header="Удаление позиции"
      text="Вы уверены, что хотите удалить эту позицию?"
    />
  )
};

export default AlertDeletePosition;