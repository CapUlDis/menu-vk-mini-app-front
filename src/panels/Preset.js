import React, { useState } from 'react';
import { Panel, PanelHeader, Title, FixedLayout, Div, Button, Separator, Subhead, Group, Cell, Avatar } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';

import API from '../utils/API';
import { PAGE_FILL_MENU } from '../router';
import breakfast from './components/img/Image.svg';
import snacks from './components/img/Image-1.svg';
import hot_meals from './components/img/Image-2.svg';
import soups from './components/img/Image-3.svg';
import drinks from './components/img/Image-4.svg';
import desserts from './components/img/Image-5.svg';
import pizza from './components/img/Image-6.svg';
import pasta from './components/img/Image-7.svg';
import burgers from './components/img/Image-8.svg';
import bakery from './components/img/Image-9.svg';


const Preset = ({ id, group, setGroup }) => {
  const router = useRouter();

  const [categories, setCategories] = useState([
    { id: 0, title: 'Завтрак', src: breakfast, isChecked: false },
    { id: 1, title: 'Закуски', src: snacks, isChecked: false },
    { id: 2, title: 'Горячие блюда', src: hot_meals, isChecked: false },
    { id: 3, title: 'Супы', src: soups, isChecked: false },
    { id: 4, title: 'Напитки', src: drinks, isChecked: false },
    { id: 5, title: 'Десерты', src: desserts, isChecked: false },
    { id: 6, title: 'Пицца', src: pizza, isChecked: false },
    { id: 7, title: 'Паста', src: pasta, isChecked: false },
    { id: 8, title: 'Бургеры', src: burgers, isChecked: false },
    { id: 9, title: 'Выпечка', src: bakery, isChecked: false },
  ]);

  const handleContinueClick = async () => {
    const cloneGroup = _.cloneDeep(group);
    cloneGroup.Categories = [];
    categories.forEach(category => {
      if (category.isChecked) {
        cloneGroup.Categories.push({
          title: category.title,
          groupId: cloneGroup.id
        });
      }
      return;
    });

    try {
      const response = await API.post('/categories', cloneGroup);
      cloneGroup.Categories = response.data.Categories;
      cloneGroup.catOrder = response.data.catOrder;
      setGroup(cloneGroup);

      console.log(cloneGroup);

      return router.pushPage(PAGE_FILL_MENU);
    } catch (err) {
      console.log(err);
    }

  }

  return (
    <Panel id={id}>
      <PanelHeader separator={false} >
        Выберите категории
      </PanelHeader>
      <Div>
        <Subhead weight='regular' align='center'>
          Выберите категории, которые представлены в вашем заведении. Позже вы сможете их изменить или создать новые.
        </Subhead>
      </Div>
      <Group>
        {categories.map(({ id, title, src, isChecked }) =>
          <Cell selectable before={<Avatar src={src} shadow={false} mode='app' />}
            key={id}
            name='categories'
            value={title}
            checked={isChecked}
            onChange={e => {
              const cloneCategories = _.cloneDeep(categories);
              cloneCategories[id].isChecked = e.target.checked;
              setCategories(cloneCategories);
            }}
          >
            {title}
          </Cell>
        )}
      </Group>
      <FixedLayout vertical='bottom'>
        <Separator wide={true} />
        <Div>
          <Button size='l' stretched onClick={handleContinueClick}>
            Продолжить
          </Button>
        </Div>
      </FixedLayout>
    </Panel>
  );
};

export default Preset;