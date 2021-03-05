import React, { useState, useEffect } from 'react';
import cloneDeep from 'lodash-es/cloneDeep';
import { Panel, PanelHeader, PanelHeaderButton, FixedLayout, Div, Group, Button, Separator, Cell, List, CellButton, Headline, Banner, usePlatform } from '@vkontakte/vkui';
import { Icon28AddCircleFillBlue } from '@vkontakte/icons';
import { Icon28EditOutline } from '@vkontakte/icons';

import API from '../utils/API';
import orderArray from '../utils/orderArray';
import { useRouter } from '@happysanta/router';
import { MODAL_CARD_CATEGORY, PAGE_FILL_MENU } from '../router';


const EditCategories = ({
  id, 

  desktop, 

  group, setGroup, 

  editMode, setEditMode, 

  categories, setCategories,

  catOrder, setCatOrder,

  newCats, setNewCats, 

  changedCats, setChangedCats,

}) => {
  const router = useRouter();

  const [deletedCats, setDeletedCats] = useState([]);

  const removeHandle = (category, catIndex) => {
    if (String(category.id).match('newId') !== null) {
      //* Только что созданная категория
      const newIndex = newCats.findIndex(cat => cat.id === category.id);
      setNewCats([...newCats.slice(0, newIndex), ...newCats.slice(newIndex + 1)]);
    } else {
      const changedIndex = changedCats.findIndex(cat => cat.id === category.id);
      if (changedIndex !== -1) {
        setChangedCats([...changedCats.slice(0, changedIndex), ...changedCats.slice(changedIndex + 1)]);
      }
      setDeletedCats([...deletedCats, catOrder[catIndex]]);
    }
    setCategories([...categories.slice(0, catIndex), ...categories.slice(catIndex + 1)]);
    return setCatOrder([...catOrder.slice(0, catIndex), ...catOrder.slice(catIndex + 1)]);
  }

  return (
    <Panel id={id}>
      <PanelHeader 
        left={
          <PanelHeaderButton onClick={() => {
            setEditMode(false);
            setCategories(group.Categories);
            setCatOrder(group.catOrder);
            setDeletedCats([]);
            setNewCats([]);
            setChangedCats([]);
            router.pushPage(PAGE_FILL_MENU);
          }}>
            Отменить
          </PanelHeaderButton>
        }
      >
        Категории
      </PanelHeader>
      <Group>
        <CellButton before={<Icon28AddCircleFillBlue/>} onClick={() => router.pushModal(MODAL_CARD_CATEGORY)}>
          Добавить категорию
        </CellButton>
        <CellButton onClick={() =>{
          console.log(categories, catOrder, deletedCats, newCats, changedCats, editMode);
        }}>
          Консоль стэйты
        </CellButton>
      </Group>
        {categories &&
          <List>
            {categories.map((category, catIndex) => {
              return (
                <Cell draggable removable
                  key={'cat' + catIndex}
                  indicator={
                    <Icon28EditOutline fill='#3F8AE0' onClick={() => {
                      router.pushModal(MODAL_CARD_CATEGORY);
                      setEditMode({ catIndex, id: category.id, title: category.title });
                    }}/>
                  }
                  onRemove={() => removeHandle(category, catIndex)}
                  onDragFinish={() => {

                  }}
                > 
                  {category.title}
                </Cell>
              );
            })}
          </List>
        }
      <FixedLayout vertical='bottom'>
        <Separator wide={true}/>
        <Div>
          <Button size='l' stretched>
            Готово
          </Button>
        </Div>
      </FixedLayout>
    </Panel>
  )
};

export default EditCategories;