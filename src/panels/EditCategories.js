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

  const abortHandle = () => {
    setEditMode(false);

    setCategories(group.Categories);
    setCatOrder(group.catOrder);

    setDeletedCats([]);
    setNewCats([]);
    setChangedCats([]);
    
    return router.pushPage(PAGE_FILL_MENU);
  }

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

  const dragFinishHandle = ({ from, to }) => {
    const cloneCatOrder = [...catOrder];
    cloneCatOrder.splice(from, 1);
    cloneCatOrder.splice(to, 0, catOrder[from]);

    const cloneCategories = [...categories];
    cloneCategories.splice(from, 1);
    cloneCategories.splice(to, 0, categories[from]);

    setCatOrder(cloneCatOrder);
    return setCategories(cloneCategories);
  }

  const submitHandle = async () => {
    //? Легитимно ли тут так сравнивать массивы
    if (catOrder !== group.catOrder || changedCats.length !== 0) {
      console.log('changed');
      const response = await API.put('/categories', { 
        catOrder:  catOrder !== group.catOrder ? catOrder : false,
        newCats, 
        deletedCats, 
        changedCats 
      });
    }

    return router.pushPage(PAGE_FILL_MENU);
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
                  onDragFinish={dragFinishHandle}
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
          <Button size='l' stretched onClick={submitHandle}>
            Готово
          </Button>
        </Div>
      </FixedLayout>
    </Panel>
  )
};

export default EditCategories;