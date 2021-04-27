import React, { useState } from 'react';
import cloneDeep from 'lodash-es/cloneDeep';
import { useRouter } from '@happysanta/router';
import {
  ModalPage,
  ModalPageHeader,
	ModalCard,
  Div,
  FormItem,
	Input,
  Button,
} from '@vkontakte/vkui';

import './AddEditCategory.css';

let num = 1;

const AddEditCategory = ({
  id, group, desktop,

  editMode, setEditMode,

  categories, setCategories,

  catOrder, setCatOrder,

  newCats, setNewCats, 

  changedCats, setChangedCats, 

  abortHandle
}) => {
  const router = useRouter();

  const [title, setTitle] = useState(!editMode ? '' : editMode.title);
  const [formStatus, setFormStatus] = useState('default');

  const submitHandle = () => {
    if (!title.trim()) {
      return setFormStatus('error');
    }

    const cloneCategories = cloneDeep(categories);

    if (!editMode) {
      //* Режим добавления новой категори
      const cloneNewCats = cloneDeep(newCats);
      const newId = `newId${num}`;
      num += 1;

      cloneCategories.push({ id: newId, title });
      cloneNewCats.push({ id: newId, title });

      setNewCats(cloneNewCats);
      setCategories(cloneCategories);
      setCatOrder([...catOrder, newId]);

    } else {
      //* Режим редактирования существующей в массиве categories категории
      if (editMode.title !== title) {
        //* Вносим изменение только если название поменялось
        cloneCategories[editMode.catIndex].title = title;

        setCategories(cloneCategories);

        if (String(editMode.id).match('newId') !== null) {
          //* Если меняем название только что созданной категории
          const newIndex = newCats.findIndex(cat => cat.id === editMode.id);
          const cloneNewCats = cloneDeep(newCats);

          cloneNewCats[newIndex].title = title;

          setNewCats(cloneNewCats);

        } else {
          //* Если меняем название категории, которая есть в БД
          const changedIndex = changedCats.findIndex(cat => cat.id === editMode.id);
          const cloneChangedCats = cloneDeep(changedCats);

          if (changedIndex === -1) {
            //* Меняем первый раз
            cloneChangedCats.push({ id: editMode.id, title });

            setChangedCats(cloneChangedCats);

          } else {
            //* Меняем категорию, которую уже меняли, но ещё не закоммитили изменения в БД
            const originalIndex = group.catOrder.indexOf(editMode.id);
            
            if (group.Categories[originalIndex].title === title) {
              //* Если название вернули на прежнее, то убираем из изменяемых
              cloneChangedCats.splice(changedIndex, 1);

              setChangedCats(cloneChangedCats);

            } else {
              cloneChangedCats[changedIndex].title = title;

              setChangedCats(cloneChangedCats);

            }
          }
          
        }
      }
    }

    router.popPage();
    return setTimeout(() => setEditMode(false), 1000);
  }

  if (desktop) {
    return (
      <ModalPage id={id}
        onClose={abortHandle}
        header={
          <ModalPageHeader>
            {!editMode ? 'Новая категория' : 'Изменить категорию' }
          </ModalPageHeader>
        }
      >
        <div className="modal-page__group">
          <FormItem status={formStatus}
            top="Название"
          >
            <Input name="title"
                form="position"
                type="text"
                value={title}
                maxLength="30"
                placeholder="Введите название категории"
                onChange={e => {
                  setTitle(e.target.value);
                }}
              />
          </FormItem>
          <Div className="footer-desktop">
            <Button className="modal-page__button" size="s" mode="primary" onClick={submitHandle}>
              {!editMode ? 'Добавить категорию' : 'Сохранить категорию'}
            </Button>
          </Div>
        </div>
      </ModalPage>
    );

  } else {
    return (
      <ModalCard id={id}
        header={!editMode ? 'Новая категория' : 'Изменить категорию' }
        onClose={abortHandle}
        actions={
          <Button size="l" mode="primary" onClick={submitHandle}>
            {!editMode ? 'Добавить' : 'Сохранить'}
          </Button>
        }
      >
        <FormItem status={formStatus}>
          <Input name="title"
            form="position"
            type="text"
            value={title}
            maxLength="30"
            placeholder="Введите название категории"
            onChange={e => {
              setTitle(e.target.value);
            }}
          />
        </FormItem>
      </ModalCard>
    );
  }
};

export default AddEditCategory;
