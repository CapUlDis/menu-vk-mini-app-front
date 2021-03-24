import React from 'react';
import { ActionSheet, ActionSheetItem } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';
import { Icon28EditOutline, Icon28DeleteOutline } from '@vkontakte/icons';

import { MODAL_PAGE_POSITION, PAGE_FILL_MENU } from '../router';


const EditDeletePosition = ({ setEditMode, deletePosition, editPositionRef }) => {
  const router = useRouter();

  return (
    <ActionSheet
      onClose={() => router.popPage()}
      iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
      toggleRef={editPositionRef.current}
    >
      <ActionSheetItem before={<Icon28EditOutline/>} onClick={() => {
        setEditMode(true);
        router.pushPage(PAGE_FILL_MENU);
        return router.pushModal(MODAL_PAGE_POSITION);
      }}>
        Редактировать
      </ActionSheetItem>
      <ActionSheetItem autoclose before={<Icon28DeleteOutline/>} mode="destructive" onClick={deletePosition}>
        Удалить позицию
      </ActionSheetItem>
    </ActionSheet>
  );
};

export default EditDeletePosition;
