import React,  { useState }from 'react';
import cloneDeep from 'lodash-es/cloneDeep';
import { Panel, PanelHeader, PanelHeaderButton, FixedLayout, Div, Group, Header, Text, Link, Cell, List, CellButton, Avatar, Separator, usePlatform } from '@vkontakte/vkui';
import { Icon28EditOutline } from '@vkontakte/icons';
import { Icon24PenOutline } from '@vkontakte/icons';
import {   } from '@vkontakte/icons';
import { Icon24ViewOutline } from '@vkontakte/icons';
import { Icon24MoreHorizontal } from '@vkontakte/icons';
import { Icon24AddOutline } from '@vkontakte/icons';

import API from '../utils/API';
import './FillMenu.css';
import orderArray from '../utils/orderArray';
import { useRouter } from '@happysanta/router';
import { MODAL_PAGE_POSITION, POPOUT_EDIT_DELETE_POSITION, PAGE_EDIT_CATEGORIES, PAGE_MENU } from '../router';


const FillMenu = ({ id, desktop, group, setGroup, setPosition, setCategories, setCatOrder }) => {
  const router = useRouter();
  const platform = usePlatform();

  return (
    <Panel id={id}>
      <PanelHeader 
        left={desktop
          ? undefined
          : <PanelHeaderButton onClick={() => {
            const cloneGroup = cloneDeep(group);
            setCategories(cloneGroup.Categories);
            setCatOrder(cloneGroup.catOrder);
            router.pushPage(PAGE_EDIT_CATEGORIES);
          }}>
            <Icon28EditOutline />
          </PanelHeaderButton>
        }
      >
        Ваше Меню
      </PanelHeader>
      {/* <CellButton onClick={() => console.log(platform)}>Консоль platform</CellButton> */}
      <Group style={{ paddingBottom: '72px' }}>
        {group.Categories.map((category, catIndex) =>
            <Group key={'cat' + category.id}
              header={
              <Header mode="primary"
                indicator={category.Positions ? category.Positions.length : 0}
                aside={
                  <Link onClick={() => {
                    setPosition({ categoryId: category.id });
                    return router.pushModal(MODAL_PAGE_POSITION);
                  }}>
                    {desktop ? 'Добавить блюдо' : <Icon24AddOutline  />}
                  </Link>
                }
              >
                {category.title}
              </Header>
            }>
              <List>
                {category.Positions && category.Positions.map(position =>
                    <Cell draggable
                      key={'pos' + position.id}
                      before={<Avatar mode='app' src={position.imageUrl} />}
                      indicator={<Icon24MoreHorizontal onClick={() => {
                        setPosition(position);
                        return router.pushPopup(POPOUT_EDIT_DELETE_POSITION);
                      }}/>}
                      description={position.price + ' ₽'}
                      onDragFinish={async ({ from, to }) => {
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
                )}
              </List>
            </Group>
        )}
      </Group>
      <FixedLayout vertical='bottom' filled>
        <Separator wide />
        <Div className={desktop ? 'footer-desktop' : undefined}>
          {desktop && <CellButton className="footer-desktop__cell-button" before={<Icon24PenOutline />}>Изменить категории</CellButton>}
          <CellButton className="footer-desktop__cell-button" before={<Icon24ViewOutline/>} onClick={() => router.pushPage(PAGE_MENU)}>Предпросмотр меню</CellButton>
        </Div>
      </FixedLayout>
    </Panel>
  );
};

export default FillMenu;
