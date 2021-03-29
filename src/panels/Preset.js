import React, { useState } from 'react';
import cloneDeep from 'lodash-es/cloneDeep';
import { Panel, PanelHeader, Text, FixedLayout, Div, Button, Separator, Subhead, Group, Cell, Avatar } from '@vkontakte/vkui';
import { Icon24DoneOutline } from '@vkontakte/icons';
import { useRouter } from '@happysanta/router';

import API from '../utils/API';
import './Preset.css';
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


const Preset = ({ id, group, setGroup, desktop }) => {
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
    let cloneGroup = cloneDeep(group);
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
      <PanelHeader className={desktop && "panel-header_desktop"} separator={false}>
        Выберите категории
      </PanelHeader>
      <FixedLayout vertical='top' filled>
        <Subhead weight='regular' align='center' className="header__subhead">
          Выберите категории, которые представлены в вашем заведении. Позже вы сможете их изменить или создать новые.
        </Subhead>
      </FixedLayout>
      <Group className="group-categories" 
        mode="plain"
        style={{ 
          paddingTop: !desktop ? '54px' : '36px',
          paddingBottom: desktop ? '56px' : '72px'
      }}>
        {categories.map(({ id, title, src, isChecked }) => 
          <Cell selectable before={<Avatar src={src} shadow={false} mode='app' />}
            className={desktop ? 'category-cell category-cell_desktop' : 'category-cell' }
            key={id}
            name='categories'
            value={title}
            checked={isChecked}
            after={desktop && isChecked && <Icon24DoneOutline/>}
            onChange={e => {
              let cloneCategories = cloneDeep(categories);
              cloneCategories[id].isChecked = e.target.checked;
              setCategories(cloneCategories);
            }}
          >
            {title}
          </Cell>
        )}
      </Group>
      <FixedLayout vertical='bottom' filled>
        <Separator wide={true}/>
        <Div className={desktop && "footer-desktop"}>
          <Button className={desktop && "footer-desktop__button"}
            align={desktop ? "right" : "center"} 
            size={desktop ? 's' : 'l'} 
            stretched={desktop ? false : true}  
            onClick={handleContinueClick}
            disabled={!categories.some(cat => cat.isChecked === true)}
          >
            Продолжить
          </Button>
        </Div>
      </FixedLayout>
    </Panel>
  );
};

export default Preset;