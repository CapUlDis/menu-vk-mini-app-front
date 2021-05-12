import React, { useState, useEffect } from 'react';
import { Panel, Placeholder, FixedLayout, Group, Tabs, HorizontalScroll, TabsItem, Header, List, RichCell, Avatar, Text, Caption, Title, Spacing } from '@vkontakte/vkui';
import { Icon28SettingsOutline } from '@vkontakte/icons';
import { useRouter } from '@happysanta/router';

import { PAGE_FILL_MENU } from '../router';
import posNoImage from './components/img/pos_no_image.png';
import units from '../utils/units';
import './Menu.css';


const Menu = ({ id, group, desktop, admin, groupInfo }) => {
  const router = useRouter();

  const hasAtLeastOnePos = () => {
    if (!group.Categories || group.Categories.length === 0) return false;

    return group.Categories.some(cat => {
      if (!cat.Positions) return false;
      
      return cat.Positions.length > 0;
    });
  };

  const twoCatHasPos = () => {
    if (!group.Categories || group.Categories.length === 0) return false;

    let pos = 0;

    for (let i = 0; i < group.Categories.length; i++) {
      if (group.Categories[i].Positions && group.Categories[i].Positions.length > 0) {
        pos++;
      }

      if (pos === 2) break;
    }

    return pos === 2;
  }

  const firstActiveTabSetter = () => {
    if (!group.Categories) return null;

    const category = group.Categories.find(cat => {
      if (!cat.Positions) return false;
      
      return cat.Positions.length > 0;
    });

    return category === undefined ? null : category.id;
  }

  const lastHasPos = () => {
    for (let i = group.Categories.length - 1; i >= 0; i--) {
      if (group.Categories[i].Positions && group.Categories[i].Positions.length > 0) {
        return `group${group.Categories[i].id}__main`
      }
    }
  };

  const [activeTab, setActiveTab] = useState(firstActiveTabSetter());
  const [contentPaddingTop, setContentPaddingTop] = useState('0px');
  const [contentPaddingBottom, setContentPaddingBottom] = useState('0px');

  useEffect(() => {
    if (hasAtLeastOnePos()) {  
      const paddingTop = document.getElementById("header").clientHeight - 8;
      const paddingBottom = document.documentElement.clientHeight 
        - document.getElementById(lastHasPos()).clientHeight
        - paddingTop 
        - 24;
      
      setContentPaddingTop(paddingTop + 'px');
      setContentPaddingBottom(paddingBottom + 'px');
    }
  }, [])

  return (
    <Panel id={id}>
      <FixedLayout className="header" id="header" vertical='top' filled>
        {admin && 
          <div className="header__settings clickable">
            <Icon28SettingsOutline width={24} height={24} fill="FFFFFF"
              onClick={() => router.pushPage(PAGE_FILL_MENU)}
            />
          </div>
        }
        {groupInfo.avatar &&
          <div className="header__images">
            <div className="header__cover" style={{ background: `url(${groupInfo.cover}) no-repeat center`, backgroundSize: 'cover' }}/>
            <Avatar size={80} src={groupInfo.avatar} className="header__avatar"/>
          </div>
        }
        <div className="header__text" id="header__text">
          <Title level='1' weight='heavy' className="header__title">{groupInfo.name}</Title>
          {groupInfo.timetable}
        </div>
        
          <Tabs className={desktop && 'header__tabs_desktop'}
            style={{ minHeight: desktop ? '28px' : '22px' }}
          >
            {twoCatHasPos() &&
              <HorizontalScroll showArrows={desktop ? true : false}
                getScrollToRight={i => i + 120}
                getScrollToLeft={i => i - 120}
              >
                {group.Categories.reduce((result, category) => {
                  if (!category.Positions || category.Positions.length === 0) return result;

                  result.push(
                    <TabsItem key={category.id}
                      onClick={() => {
                        setActiveTab(category.id);
                        const verPos = document.getElementById('group' + category.id + '__main').offsetTop
                          - document.getElementById('header').offsetHeight 
                          - 8;
                        window.scrollTo(0, verPos);
                      }}
                      selected={activeTab === category.id}
                    >
                      {category.title}
                    </TabsItem>
                  );

                  return result;
                }, [])}
              </HorizontalScroll>
            }
          </Tabs>
        
        <Spacing separator size={desktop? 1 : 8} className={desktop && 'header__separator_desktop'}/>
      </FixedLayout>
      {hasAtLeastOnePos()
        ? <Group id='main' mode='plain' style={{ 
          paddingTop: contentPaddingTop,
          paddingBottom: contentPaddingBottom 
        }}>
          {group.Categories.reduce((result, category) => {
            if (!category.Positions || category.Positions.length === 0) return result;

            result.push(
              <Group mode="plain"
                key={'group' + category.id} 
                id={'group' + category.id}
                header={
                  <Header mode='primary'>
                    {category.title}
                  </Header>
              }>
                <List id={'group' + category.id + '__main'}
                  className={desktop && 'position-list_desktop'}
                >
                  {category.Positions.map(position => {
                    if (desktop) {
                      return (
                        <div className="position-desktop" key={'position-desktop' + position.id}>
                          <Avatar size={190} mode='image' src={position.imageUrl ? position.imageUrl : posNoImage}/>
                          <Text className="position-desktop__title">{position.title}</Text>
                          <Caption className="position-desktop__description" level='1' weight='regular'>{position.description}</Caption>
                          <div className="position__bottom position__bottom_desktop">
                            <Text>{position.price + ' ₽'}</Text>
                            <Caption className="position__value" level='1' weight='regular'>{'· ' + position.value + ' ' + units[position.unitId].nick}</Caption>
                          </div>
                        </div>
                      )
                    } else {
                      return (
                        <RichCell className="position"
                          key={'richCell' + position.id}
                          disabled
                          multiline
                          before={<Avatar size={72} mode='app' src={position.imageUrl ? position.imageUrl : posNoImage}/>}
                          text={position.description}
                          bottom={
                            <div className="position__bottom">
                              <Text>{position.price + ' ₽'}</Text>
                              <Caption className="position__value" level='1' weight='regular'>{'· ' + position.value + ' ' + units[position.unitId].nick}</Caption>
                            </div>
                          }
                        >
                          {position.title}
                        </RichCell>
                      );
                    }
                  })}
                </List>
              </Group>
            );
            
            return result;
          }, [])}
        </Group>
        : <Placeholder stretched style={{
          paddingTop: !groupInfo.avatar ? (!groupInfo.timetable ? '97px' : '129px') : (!groupInfo.timetable ? '309px' : '341px'),
        }}>
          Меню еще не составлено
        </Placeholder>
      }
    </Panel>
  );
}

export default Menu;