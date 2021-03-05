import React, { useState } from 'react';
import { useRouter } from '@happysanta/router';
import {
	ModalCard,
  FormItem,
	Input,
  Button,
} from '@vkontakte/vkui';

import { PAGE_EDIT_CATEGORIES } from '../router';

const AddEditCategory = ({
  id, 

  editMode, setEditMode,

  categories, setCategories,

  catOrder, setCatOrder,

  newCats, setNewCats, 

  changedCats, setChangedCats, 
}) => {
  const router = useRouter();

  const [title, setTitle] = useState(!editMode ? '' : editMode.title);
  const [formStatus, setFormStatus] = useState('default');

  const submitHandle = () => {
    console.log('submit');

    if (!title.trim()) {
      return setFormStatus('error');
    }

    if (!editMode) {
      //* Режим добавления новой категори
      const newId = `newId${newCats.length + 1}`

      setNewCats([...newCats, { id: newId, title }]);
      setCategories([...categories, { id: newId, title }]);
      setCatOrder([...catOrder, newId]);

    } else {
      //* Режим редактирования существующей в массиве categories категории
      if (editMode.title !== title) {
        //* Вносим изменение только если название поменялось
        const cloneCategories = [...categories];
        cloneCategories[editMode.catIndex] = { id: editMode.id, title };
        setCategories(cloneCategories);

        if (String(editMode.id).match('newId') !== null) {
          //* Если меняем название только что созданной категории
          const newIndex = newCats.findIndex(cat => cat.id === editMode.id);
          const cloneNewCats = [...newCats];
          cloneNewCats[newIndex] = { id: editMode.id, title };
          setNewCats(cloneNewCats);

        } else {
          //* Если меняем название категории, которая есть в БД
          const changedIndex = changedCats.findIndex(cat => cat.id === editMode.id);
          if (changedIndex === -1) {
            //* Меняем первый раз
            setChangedCats([...changedCats, { id: editMode.id, title }]);
          } else {
            //* Меняем категорию, которую уже меняли, но ещё не закоммитили изменения в БД
            const cloneChangedCats = [...changedCats];
            cloneChangedCats[changedIndex] = { id: editMode.id, title };
            setChangedCats(cloneChangedCats);
          }
          
        }
      }
    }

    router.pushPage(PAGE_EDIT_CATEGORIES);
    return setTimeout(() => setEditMode(false), 100);
  }

  return (
    <ModalCard id={id}
      header={!editMode ? 'Новая категория' : 'Изменить категорию' }
      onClose={() => {
        router.popPage();
        setTimeout(() => setEditMode(false), 100);
      }}
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
};

export default AddEditCategory;
