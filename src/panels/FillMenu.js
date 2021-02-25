import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderButton, FixedLayout, Div, Group, Header, Link, Cell, CellButton, Avatar, Banner, usePlatform } from '@vkontakte/vkui';
import { Icon28EditOutline } from '@vkontakte/icons';
import { Icon24PenOutline } from '@vkontakte/icons';
import { Icon20Add } from '@vkontakte/icons';
import { Icon24ViewOutline } from '@vkontakte/icons';
import { Icon24MoreHorizontal } from '@vkontakte/icons';

import foodVk from './components/img/foodvk.svg';
import { useRouter } from '@happysanta/router';
import { MODAL_PAGE_POSITION } from '../router';


const FillMenu = ({ id, desktop, group, setGroup, setPosition }) => {
  const router = useRouter();

  return (
    <Panel id={id}>
      <PanelHeader separator={false}
        left={!desktop && <PanelHeaderButton><Icon28EditOutline /></PanelHeaderButton>}
      >
        Ваше Меню
      </PanelHeader>
      <Banner
        before={<img src={foodVk} />}
        text='Добавьте ссылку на страницу заведения в Еде ВКонтакте'
      />

      {group.Categories.map(category => {
        return (
          <Group key={'cat' + category.id} header={
            <Header mode="primary"
              indicator={category.Positions ? category.Positions.length : 0}
              aside={
                <Link onClick={() => {
                  setPosition({ categoryId: category.id });
                  return router.pushModal(MODAL_PAGE_POSITION);
                }}>
                  {desktop ? 'Добавить блюдо' : <Icon20Add />}
                </Link>
              }
            >
              {category.title}
            </Header>
          }>
            {category.Positions && category.Positions.map(position => {
              return (
                <Cell draggable
                  key={'pos' + position.id}
                  before={<Avatar mode='app' src={position.imageUrl} />}
                  indicator={<Icon24MoreHorizontal />}
                  description={position.price + ' ₽'}
                >
                  {position.title}
                </Cell>
              );
            })}
          </Group>
        )
      })}
      <FixedLayout vertical='bottom'>
        <Div>
          {desktop && <CellButton before={<Icon24PenOutline />}>Изменить категории</CellButton>}
          <CellButton before={<Icon24ViewOutline />}>Предпросмотр меню</CellButton>
        </Div>
      </FixedLayout>
    </Panel>
  );
};

export default FillMenu;
