import React from 'react';
import cloneDeep from 'lodash-es/cloneDeep';
import { Panel, PanelHeader, PanelHeaderButton, FixedLayout, Div, Group, Header, Link, Cell, List, CellButton, Avatar, Banner, usePlatform } from '@vkontakte/vkui';
import { Icon28EditOutline } from '@vkontakte/icons';
import { Icon24PenOutline } from '@vkontakte/icons';
import { Icon20Add } from '@vkontakte/icons';
import { Icon24ViewOutline } from '@vkontakte/icons';
import { Icon24MoreHorizontal } from '@vkontakte/icons';

import API from '../utils/API';
import foodVk from './components/img/foodvk.svg';
import orderArray from '../utils/orderArray';
import { useRouter } from '@happysanta/router';
import { MODAL_PAGE_POSITION, POPOUT_EDIT_DELETE_POSITION, PAGE_EDIT_CATEGORIES } from '../router';


const FillMenu = ({ id, desktop, group, setGroup, setPosition }) => {
  const router = useRouter();

  return (
    <Panel id={id}>
      <PanelHeader separator={false}
        left={!desktop && <PanelHeaderButton onClick={() => router.pushPage(PAGE_EDIT_CATEGORIES)}><Icon28EditOutline /></PanelHeaderButton>}
      >
        Ваше Меню
      </PanelHeader>
      <Banner
        before={<img src={foodVk} />}
        text='Добавьте ссылку на страницу заведения в Еде ВКонтакте'
      />
      <CellButton onClick={() => console.log(group)}>Консоль групп</CellButton>
      {group.Categories.map((category, catIndex) => {
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
            <List>
              {category.Positions && category.Positions.map(position => {
                return (
                  <Cell draggable
                    key={'pos' + position.id}
                    before={<Avatar mode='app' src={position.imageUrl} />}
                    indicator={<Icon24MoreHorizontal onClick={() => {
                      setPosition(position);
                      return router.pushPopup(POPOUT_EDIT_DELETE_POSITION);
                    }}/>}
                    description={position.price + ' ₽'}
                    onDragFinish={async ({ from, to }) => {
                      const cloneGroup = cloneDeep(group);
                      cloneGroup.Categories[catIndex].posOrder.splice(from, 1);
                      cloneGroup.Categories[catIndex].posOrder.splice(to, 0, group.Categories[catIndex].posOrder[from]);
                      cloneGroup.Categories[catIndex].Positions = orderArray(cloneGroup.Categories[catIndex].Positions, cloneGroup.Categories[catIndex].posOrder, 'id');
                      setGroup(cloneGroup);
                      try {
                        const cloneGroup = cloneDeep(group);
                        cloneGroup.Categories[catIndex].posOrder.splice(from, 1);
                        cloneGroup.Categories[catIndex].posOrder.splice(to, 0, group.Categories[catIndex].posOrder[from]);
                        cloneGroup.Categories[catIndex].Positions = orderArray(cloneGroup.Categories[catIndex].Positions, cloneGroup.Categories[catIndex].posOrder, 'id');

                        await API.patch(`/categories/${category.id}`, { posOrder: cloneGroup.Categories[catIndex].posOrder })
                        setGroup(cloneGroup);
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                  >
                    {position.title}
                  </Cell>
                );
              })}
            </List>
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
