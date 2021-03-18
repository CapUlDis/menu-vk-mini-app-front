import React, { useState, useEffect } from 'react';
import { Panel, Placeholder, FixedLayout, Group, Tabs, HorizontalScroll, TabsItem, Header, List, RichCell, PanelHeader, Avatar, Text, Caption, Title, Subhead, Spacing } from '@vkontakte/vkui';
import { Icon28SettingsOutline } from '@vkontakte/icons';
import { useRouter } from '@happysanta/router';

import { PAGE_FILL_MENU } from '../router';
import units from '../utils/units';
import './Menu.css';


const Menu = ({ id, group, desktop, admin, groupInfo }) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(group.Categories[0].id);
  const [contentPaddingBottom, setContentPaddingBottom] = useState('0px')

  useEffect(() => {
    let paddingBottom = document.documentElement.clientHeight 
          - document.getElementById(`group${group.Categories[group.Categories.length - 1].id}__main`).clientHeight
          - (!groupInfo.avatar ? (!groupInfo.timetable ? 87 : 119) : (!groupInfo.timetable ? 299 : 331))
          - 16;
    
    setContentPaddingBottom(paddingBottom + 'px');
  }, [])

  return (
    <Panel id={id}>
      <FixedLayout id="header" vertical='top' filled>
        {admin && <Icon28SettingsOutline className="header__settings" fill={groupInfo.avatar ? '#FFFFFF' : '#000000'} onClick={() =>{
          router.pushPage(PAGE_FILL_MENU);
        }}/>}
        {groupInfo.avatar &&
          <div className="header__images">
            <div className="header__cover" style={{ background: `url(${groupInfo.cover}) no-repeat center`, backgroundSize: 'cover' }}/>
            <Avatar size={80} src={groupInfo.avatar} className="header__avatar"/>
          </div>
        }
        <div className="header__text">
          <Title level='1' weight='heavy' className="header__title">{groupInfo.name}</Title>
          {groupInfo.timetable}
        </div>
        {group.Categories &&
          <Tabs className={desktop && 'header__tabs_desktop'}>
            <HorizontalScroll showArrows={desktop ? true : false}
              getScrollToRight={i => i + 120}
              getScrollToLeft={i => i - 120}
            >
              {group.Categories.map(category => 
                <TabsItem key={category.id}
                  onClick={() => {
                    setActiveTab(category.id);
                    const verPos = document.getElementById('group' + category.id + '__main').offsetTop
                      - document.getElementById('header').offsetHeight;
                    window.scrollTo(0, verPos);
                  }}
                  selected={activeTab === category.id}
                >
                  {category.title}
                </TabsItem>
              )}
            </HorizontalScroll>
          </Tabs>
        }
        <Spacing separator size={desktop? 1 : 8} className={desktop && 'header__separator_desktop'}/>
      </FixedLayout>
      {group.Categories && group.Categories.length > 0 
        ? <Group id='main' style={{ 
          paddingTop: !groupInfo.avatar ? (!groupInfo.timetable ? '87px' : '119px') : (!groupInfo.timetable ? '299px' : '331px'),
          paddingBottom: contentPaddingBottom 
        }}>
          {group.Categories.map(category => {
            return (
              <Group className="category-group"
                key={'group' + category.id} 
                id={'group' + category.id}
                header={
                  <Header className={desktop ? "category-group__header category-group__header_desktop" : "category-group__header"} mode='primary'>
                    {category.title}
                  </Header>
              }>
                {category.Positions &&
                  <List id={'group' + category.id + '__main'}
                    className={desktop && 'position-list_desktop'}
                  >
                    {category.Positions.map(position => {
                      if (desktop) {
                        return (
                          <div className="position-desktop" key={'position-desktop' + position.id}>
                            <Avatar size={190} mode='image' src={position.imageUrl}/>
                            <Text className="position-desktop__title">{position.title}</Text>
                            <Caption className="position-desktop__description" level='1' weight='regular'>{position.description}</Caption>
                            <div className="position__bottom position__bottom_desktop">
                              <Text>{position.price + '₽'}</Text>
                              <Caption className="position__value" level='1' weight='regular'>{'· ' + position.value + units[position.unitId].nick}</Caption>
                            </div>
                          </div>
                        )
                      } else {
                        return (
                          <RichCell className="position"
                            key={'richCell' + position.id}
                            disabled
                            multiline
                            before={<Avatar size={72} mode='app' src={position.imageUrl}/>}
                            text={position.description}
                            bottom={
                              <div className="position__bottom">
                                <Text>{position.price + '₽'}</Text>
                                <Caption className="position__value" level='1' weight='regular'>{'· ' + position.value + units[position.unitId].nick}</Caption>
                              </div>
                            }
                          >
                            {position.title}
                          </RichCell>
                        );
                      }
                    })}
                  </List>
                }
              </Group>
            );
          })}
        </Group>
        : <Placeholder style={{
          paddingTop: !groupInfo.avatar ? (!groupInfo.timetable ? '97px' : '129px') : (!groupInfo.timetable ? '309px' : '341px'),
        }}>
          Меню еще не составлено
        </Placeholder>
      }
    </Panel>
  );
}

export default Menu;