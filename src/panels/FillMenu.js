import React,  { useState, useEffect } from 'react';
import cloneDeep from 'lodash-es/cloneDeep';
import { BridgePlus } from "@happysanta/bridge-plus";
import bridge from "@vkontakte/vk-bridge";
import { Panel, PanelHeader, PanelHeaderButton, FixedLayout, Div, Group, Header, Tooltip, Link, Cell, List, CellButton, Avatar, Separator, Button } from '@vkontakte/vkui';
import { Icon28EditOutline } from '@vkontakte/icons';
import { Icon24PenOutline } from '@vkontakte/icons';
import { Icon24ViewOutline } from '@vkontakte/icons';
import { Icon24MoreHorizontal } from '@vkontakte/icons';
import { Icon24AddOutline } from '@vkontakte/icons';

import API from '../utils/API';
import './FillMenu.css';
import orderArray from '../utils/orderArray';
import mapPlatform from '../utils/mapPlatform';
import { useRouter } from '@happysanta/router';
import { MODAL_PAGE_POSITION, POPOUT_EDIT_DELETE_POSITION, PAGE_EDIT_CATEGORIES, PAGE_MENU } from '../router';


const STORAGE_KEYS = {
  SEEN_TOOLTIP: 'menu_zav_seen_tooltip'
}

const FillMenu = ({ id, desktop, group, setGroup, setPosition, setCategories, setCatOrder, editPosRefs }) => {
  const router = useRouter();
  const platform = mapPlatform(BridgePlus.getStartParams().getPlatform());

  const [tooltip, setTooltip] = useState(false);

  const getPosRefIndex = (catIndex, posIndex) => {
    let index = posIndex;

    for (let i = 0; i < catIndex; i ++) {
      if (group.Categories[i].Positions) {
        index += group.Categories[i].Positions.length;
      }
    }

    return index;
  }

  const editCategoriesHandle = () => {
    console.log(0);
    const cloneGroup = cloneDeep(group);
    setCategories(cloneGroup.Categories);
    setCatOrder(cloneGroup.catOrder);
    
    return router.pushPage(PAGE_EDIT_CATEGORIES);
  }

  useEffect(() => {
    (async () => {
      const userHasSeenTooltip = await bridge.send("VKWebAppStorageGet", {"keys": [STORAGE_KEYS.SEEN_TOOLTIP]})
        .then(response => { return response.keys[0].value });

      if (!userHasSeenTooltip) {
        await bridge.send('VKWebAppStorageSet', {
          key: STORAGE_KEYS.SEEN_TOOLTIP,
          value: "true"
        });
        return setTooltip(true);
      }

      return setTooltip(false);
    })();
  }, []);

  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <PanelHeader fixed={true}
        left={desktop
          ? undefined
          : <PanelHeaderButton onClick={editCategoriesHandle}>
            <Icon28EditOutline />
          </PanelHeaderButton>
        }
      >
        Ваше Меню
      </PanelHeader>
      {/* <CellButton onClick={() => console.log(platform)}>Консоль platform</CellButton> */}
      <Group style={{ paddingBottom: desktop ? '56px' : '72px' }}
        mode="plain"
      >
        {group.Categories.map((category, catIndex) =>
          <Group key={'cat' + category.id}
            mode="plain"
            className="category-group"
            header={
            <Header mode="primary"
              indicator={category.Positions ? category.Positions.length : 0}
              aside={catIndex === 0
                ? <Tooltip className="category-group__tooltip"
                  text="Теперь добавьте блюда в каждую категорию"
                  isShown={tooltip}
                  onClose={() => setTooltip(false)}
                  alignX="right"
                  offsetX={9}
                  cornerOffset={-9}
                >
                  <Link onClick={() => {
                    setPosition({ categoryId: category.id });
                    return router.pushModal(MODAL_PAGE_POSITION);
                  }}>
                    {desktop ? 'Добавить блюдо' : <Icon24AddOutline/>}
                  </Link>
                </Tooltip>
                : <Link onClick={() => {
                  setPosition({ categoryId: category.id });
                  return router.pushModal(MODAL_PAGE_POSITION);
                }}>
                  {desktop ? 'Добавить блюдо' : <Icon24AddOutline/>}
                </Link>
              }
            >
              {category.title}
            </Header>
          }>
            <List>
              {category.Positions && category.Positions.map((position, posIndex) =>
                <Cell draggable
                  key={'pos' + position.id}
                  before={<Avatar mode='app' src={position.imageUrl} />}
                  indicator={<Icon24MoreHorizontal className={platform === 'ios' && 'icon-right_ios'}
                    getRootRef={editPosRefs[getPosRefIndex(catIndex, posIndex)]} 
                    onClick={() => {
                      setPosition(position);
                      return router.pushPopup(POPOUT_EDIT_DELETE_POSITION, { index: getPosRefIndex(catIndex, posIndex) });
                    }}
                  />}
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
        {desktop  
          ? <Div className='footer-desktop'>
            <Button className="footer-desktop__left-button"
              size="s"
              mode="tertiary"
              before={<Icon24PenOutline />}
              onClick={editCategoriesHandle}
            >
              Изменить категории
            </Button> 
            <Button className="footer-desktop__left-button"
              size="s"
              mode="tertiary"
              before={<Icon24ViewOutline/>}
              onClick={() => router.pushPage(PAGE_MENU)}
            >
              Предпросмотр меню
            </Button>
          </Div>
          : <Div>
            <CellButton
              before={<Icon24ViewOutline/>}
              onClick={() => router.pushPage(PAGE_MENU)}
            >
              Предпросмотр меню
            </CellButton>
          </Div>
        }
      </FixedLayout>
    </Panel>
  );
};

export default FillMenu;
