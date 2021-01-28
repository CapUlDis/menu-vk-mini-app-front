import React from 'react';
import { Panel, PanelHeader, Title, FixedLayout, Div, Button, Subhead, Group, Cell, Avatar } from '@vkontakte/vkui';

import categories from './components/Categories';

const Preset = ({ id, menuInfo, setMenuInfo }) => {

    // const handleCheckCategory = (id, ) => {
    //     const cloneMenuInfo = _.cloneDeep(menuInfo);
    //     cloneMenuInfo.categories[id].isChecked
    // }
    
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
                {categories.map(({ id, title, src }) => 
                    <Cell selectable before={<Avatar src={src} shadow={false} mode='app'/>} 
                        key={id}
                        name='categories'
                        value={title}
                        checked={menuInfo.categories[id].isChecked}
                        onChange={e => {
                            const cloneMenuInfo = _.cloneDeep(menuInfo);
                            cloneMenuInfo.categories[id].isChecked = e.target.checked;
                            setMenuInfo(cloneMenuInfo);
                        }}
                    >
                        {title}
                    </Cell>
                )}
            </Group>
            <FixedLayout vertical='bottom'>
                <Div>
                    <Button size='l' stretched>
                        Продолжить
                    </Button>
                </Div>
            </FixedLayout>
        </Panel>
    );
};

export default Preset;