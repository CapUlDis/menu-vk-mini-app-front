import React, { useState } from 'react';
import cloneDeep from 'lodash-es/cloneDeep';
import { BridgePlus } from "@happysanta/bridge-plus";
import { Panel, PanelHeader, PanelHeaderButton, FixedLayout, Div, Group, Button, Separator, Cell, List, CellButton, Text } from '@vkontakte/vkui';
import { Icon20AddCircle } from '@vkontakte/icons';
import { Icon28EditOutline } from '@vkontakte/icons';
import { Icon24AddOutline } from '@vkontakte/icons';

import './EditCategories.css';
import SnackbarError from '../popouts/SnackbarError';
import API from '../utils/API';
import arrayEquals from '../utils/arrayEquals';
import mapPlatform from '../utils/mapPlatform';
import { useRouter } from '@happysanta/router';
import { disableScroll } from '../utils/bodyScroll';
import { MODAL_CARD_CATEGORY, PAGE_FILL_MENU } from '../router';


const EditCategories = ({
  id, 

  group, setGroup,
  
  desktop, setEditMode,

  categories, setCategories,

  catOrder, setCatOrder,

  newCats, setNewCats, 

  changedCats, setChangedCats,

}) => {
  const router = useRouter();
  const platform = mapPlatform(BridgePlus.getStartParams().getPlatform());

  const [snackbarError, setSnackbarError] = useState(null);
  const [deletedCats, setDeletedCats] = useState([]);
  const [submitDisable, setSubmitDisable] = useState(false);

  const abortHandle = () => {
    const cloneGroup = cloneDeep(group);

    setEditMode(false);
    setCategories(cloneGroup.Categories);
    setCatOrder(cloneGroup.catOrder);
    setDeletedCats([]);
    setNewCats([]);
    setChangedCats([]);
    
    return router.pushPage(PAGE_FILL_MENU);
  }

  const removeHandle = (category, catIndex) => {
    const cloneCategories = cloneDeep(categories);

    cloneCategories.splice(catIndex, 1);

    setCategories(cloneCategories);

    if (String(category.id).match('newId') !== null) {
      //* Только что созданная категория
      const newIndex = newCats.findIndex(cat => cat.id === category.id);
      const cloneNewCats = cloneDeep(newCats);

      cloneNewCats.splice(newIndex, 1)

      setNewCats(cloneNewCats);

    } else {
      const changedIndex = changedCats.findIndex(cat => cat.id === category.id);

      if (changedIndex !== -1) {
        const cloneChangedCats = cloneDeep(changedCats);

        cloneChangedCats.splice(changedIndex, 1);

        setChangedCats(cloneChangedCats);
      }

      setDeletedCats([...deletedCats, catOrder[catIndex]]);

    }

    return setCatOrder([...catOrder.slice(0, catIndex), ...catOrder.slice(catIndex + 1)]);
  }

  const editHandle = (catIndex, category) => {
    disableScroll(id);
    setEditMode({ catIndex, id: category.id, title: category.title });
    return router.pushModal(MODAL_CARD_CATEGORY);
  }

  const dragFinishHandle = ({ from, to }) => {
    const cloneCatOrder = [...catOrder];
    cloneCatOrder.splice(from, 1);
    cloneCatOrder.splice(to, 0, catOrder[from]);

    const cloneCategories = cloneDeep(categories);
    cloneCategories.splice(from, 1);
    cloneCategories.splice(to, 0, categories[from]);

    setCatOrder(cloneCatOrder);
    return setCategories(cloneCategories);
  }

  const submitHandle = async () => {
    setSubmitDisable(true);

    try {
      if (!arrayEquals(catOrder, group.catOrder) || changedCats.length !== 0) {
        const response = await API.put('/categories', { 
          catOrder:  !arrayEquals(catOrder, group.catOrder) ? catOrder : false,
          newCats, 
          deletedCats, 
          changedCats,
        }).then(response => response.data.group);
        const cloneGroup = cloneDeep(response);

        setGroup(response);
        setCategories(cloneGroup.Categories);
        setCatOrder(cloneGroup.catOrder);
        setDeletedCats([]);
        setChangedCats([]);
        setNewCats([]);
      }

      return router.pushPage(PAGE_FILL_MENU);
    } catch (err) {
      
      setSubmitDisable(false);
      return setSnackbarError(
        <SnackbarError setSnackbarError={setSnackbarError}>
          Проблемы с получением данных от сервера. Проверьте интернет-соединение.
        </SnackbarError>
      );
    }
  }

  return (
    <Panel id={id}>
      <PanelHeader 
        left={
          <PanelHeaderButton onClick={abortHandle}>
            Отменить
          </PanelHeaderButton>
        }
      >
        Категории
      </PanelHeader>
      <Group style={{ paddingBottom: desktop ? '56px' : '72px' }}
        mode="plain"
      >
        {!desktop && 
          <CellButton before={<Icon20AddCircle height={22} width={22}/>} onClick={() => {
            disableScroll(id);
            router.pushModal(MODAL_CARD_CATEGORY)
          }}>
            Добавить категорию
          </CellButton>
        }
        {categories &&
          <List>
            {categories.map((category, catIndex) => {
              if (!desktop) {
                return (
                  <Cell draggable removable
                    className='category-cell_mobile'
                    key={'cat' + catIndex}
                    indicator={
                      <Icon28EditOutline className={platform === 'ios' && 'icon-right_ios'} fill='#3F8AE0' onClick={() => editHandle(catIndex, category)}/>
                    }
                    onRemove={() => removeHandle(category, catIndex)}
                    onDragFinish={dragFinishHandle}
                  > 
                    {category.title}
                  </Cell>
                );
              } else {
                return (
                  <Cell draggable
                    className='category-cell'
                    key={'cat' + catIndex}
                    onDragFinish={dragFinishHandle}
                    after={
                      <div className='category-cell__button-block'>
                        <Text weight='regular' className="category-cell__button" onClick={() => editHandle(catIndex, category)}>Редактировать</Text>
                        <Text weight='regular' className='category-cell__point'> · </Text>
                        <Text weight='regular' className="category-cell__button" onClick={() => removeHandle(category, catIndex)}>Удалить</Text>
                      </div>
                    }
                  >
                    {category.title}
                  </Cell>
                );
              }
            })}
          </List>
        }
      </Group>
      <FixedLayout vertical='bottom' filled>
        <Separator wide={true}/>
        {desktop
          ? <Div className="footer-desktop">
            <Button className="footer-desktop__left-button"
              size="s"
              mode="tertiary"
              before={<Icon24AddOutline />}
              onClick={() => {
                disableScroll(id);
                router.pushModal(MODAL_CARD_CATEGORY)
              }}
            >
              Добавить категорию
            </Button> 
            <Button className="footer-desktop__button"
              size='s'
              disabled={submitDisable}
              onClick={submitHandle}
            >
              Готово
            </Button>
          </Div>
          : <Div>
            <Button size='l' 
              stretched 
              disabled={submitDisable}
              onClick={submitHandle}
            >
              Готово
            </Button>
          </Div>
        }
      </FixedLayout>
      {snackbarError}
    </Panel>
  )
};

export default EditCategories;