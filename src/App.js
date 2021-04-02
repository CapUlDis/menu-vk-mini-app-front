import React, { useEffect, useState } from 'react';
import { BridgePlus } from "@happysanta/bridge-plus";
import qs from 'querystring';
import _ from 'lodash';
import cloneDeep from 'lodash-es/cloneDeep';
import { AppRoot, SplitLayout, SplitCol, Root, View, Panel, Subhead, ScreenSpinner, ModalRoot } from '@vkontakte/vkui';
import { useLocation, useRouter } from '@happysanta/router';
import '@vkontakte/vkui/dist/vkui.css';

import {
  VIEW_LENDING,
  VIEW_MAIN,
  VIEW_MENU,
  PANEL_INSTALL,
  PANEL_START,
  PANEL_FILL_MENU,
  PANEL_EDIT_CATEGORIES,
  PANEL_MENU,
  PAGE_INSTALL,
  PAGE_START,
  PAGE_MENU,
  MODAL_PAGE_POSITION,
  MODAL_CARD_CATEGORY,
  POPOUT_EDIT_DELETE_POSITION
} from './router';
import Install from './panels/Install';
import Start from './panels/Start';
import FillMenu from './panels/FillMenu';
import EditCategories from './panels/EditCategories';
import Menu from './panels/Menu';
import AddEditPosition from './modals/AddEditPosition';
import AddEditCategory from './modals/AddEditCategory';
import EditDeletePosition from './popouts/EditDeletePosition';
import API from './utils/API';
import mapPlatform from './utils/mapPlatform';
import getPositionSum from "./utils/getPositionSum";


const STEPS = {
  LOADER: 'loader',
  MAIN: 'main'
};

const platform = mapPlatform(BridgePlus.getStartParams().getPlatform());

const App = () => {
  const location = useLocation();
  const router = useRouter();

  const [admin, setAdmin] = useState(false);
  const [step, setStep] = useState(STEPS.LOADER);
  const [snackbarError, setSnackbarError] = useState(null);
  const [group, setGroup] = useState({});
  const [desktop, setDesktop] = useState(false);
  const [watchFlag, setWatchFlag] = useState(0);
  const [position, setPosition] = useState({});
  const [editMode, setEditMode] = useState(false);

  // EditCategories hooks:
  const [categories, setCategories] = useState({});
  const [catOrder, setCatOrder] = useState([]);
  const [newCats, setNewCats] = useState([]);
  const [changedCats, setChangedCats] = useState([]);

  const [groupInfo, setGroupInfo] = useState({
    name: '', 
    avatar: '', 
    cover: '', 
    timetable: '', 
    close: true,
  });

  const [editPosRefs, setEditPosRefs] = useState([]);

  const deletePosition = async () => {
    try {
      await API.delete(`/positions/${position.id}`);
      let cloneGroup = cloneDeep(group);
      const catIndex = cloneGroup.catOrder.indexOf(position.categoryId);
      const posIndex = cloneGroup.Categories[catIndex].posOrder.indexOf(position.id);
      if (catIndex === -1 || posIndex === -1) {
        throw new Error('Corrupted position and group data. Reload app.');
      }
      cloneGroup.Categories[catIndex].Positions.splice(posIndex, 1);
      cloneGroup.Categories[catIndex].posOrder.splice(posIndex, 1);
      setGroup(cloneGroup);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchGroupInfo = async ({ vkGroupId }) => {
    const response = await BridgePlus.api("groups.getById", { group_id: vkGroupId, fields: "addresses,cover,has_photo" })
      .then(({ response: [groupInfo] }) => { return groupInfo });
    
    let cloneGroupInfo = {...groupInfo};
    console.log(response);

    cloneGroupInfo.name = response.name;

    if (response.has_photo + response.cover.enabled === 2) {
      cloneGroupInfo.avatar = response.photo_200;
      cloneGroupInfo.cover = response.cover.images[4].url;
    }

    if (response.addresses.is_enabled) {
      const mainAdress = await BridgePlus.api("groups.getAddresses", { group_id: vkGroupId, address_ids: response.addresses.main_address_id, fields: "timetable" })
        .then(({ response }) => { return response.items[0] });

      const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const today = new Date();
      const currentMinutes = 60 * today.getHours() + today.getMinutes();
      const day = daysOfWeek[today.getDay()];
      
      if (mainAdress.timetable[day]) {
        
        if (currentMinutes < mainAdress.timetable[day].open_time) {
          const minutes = mainAdress.timetable[day].open_time % 60;
          const hours = (mainAdress.timetable[day].open_time - minutes) / 60;
          cloneGroupInfo.timetable = <Subhead weight='regular' className="header__open"><span style={{ color: 'var(--dynamic_red)'}}>Закрыто</span> · откроется в {hours}:{('0' + minutes).slice(-2)}</Subhead>;

        } else if (currentMinutes >= mainAdress.timetable[day].open_time && currentMinutes < mainAdress.timetable[day].close_time) {
          const minutes = mainAdress.timetable[day].close_time % 60;
          const hours = (mainAdress.timetable[day].close_time - minutes) / 60;
          cloneGroupInfo.close = false;
          cloneGroupInfo.timetable = <Subhead weight='regular' className="header__open">открыто до {hours}:{('0' + minutes).slice(-2)}</Subhead>;

        } else if (currentMinutes >= mainAdress.timetable[day].close_time) {
          const nextDay = today.getDay() === 6 ? daysOfWeek[0] : daysOfWeek[today.getDay() + 1];

          if (mainAdress.timetable[nextDay]) {
            const minutes = mainAdress.timetable[nextDay].open_time % 60;
            const hours = (mainAdress.timetable[nextDay].open_time - minutes) / 60;
            cloneGroupInfo.timetable = <Subhead weight='regular' className="header__open"><span style={{ color: 'var(--dynamic_red)'}}>Закрыто</span> · откроется в {hours}:{('0' + minutes).slice(-2)}</Subhead>;
          }
        }
      } else {
        const nextDay = today.getDay() === 6 ? daysOfWeek[0] : daysOfWeek[today.getDay() + 1];

        if (mainAdress.timetable[nextDay]) {
          const minutes = mainAdress.timetable[nextDay].open_time % 60;
          const hours = (mainAdress.timetable[nextDay].open_time - minutes) / 60;
          cloneGroupInfo.timetable = <Subhead weight='regular' className="header__open"><span style={{ color: 'var(--dynamic_red)'}}>Закрыто</span> · откроется завтра в {hours}:{('0' + minutes).slice(-2)}</Subhead>;
        }
      }
    }

    setGroupInfo(cloneGroupInfo);
  };

  const fetchMenu = async (launchParams) => {
    try {
      const response = await API.get(`/groups`)
        .then(response => {
          return response.data.group
        });

      await fetchGroupInfo({ vkGroupId: response.vkGroupId });

      setGroup(response);
      if (launchParams.vk_viewer_group_role === 'admin') setAdmin(true);
      setStep(STEPS.MAIN);

      return router.pushPage(PAGE_MENU);

    } catch (error) {
      if (error.response.status === 404 
        && error.response.data.message === 'Group with specified Id not found') { 
          await fetchGroupInfo({ vkGroupId: launchParams.vk_group_id });
          setStep(STEPS.MAIN);
          
          if (launchParams.vk_viewer_group_role === 'admin') {
            setAdmin(true);

            return router.pushPage(PAGE_START);
          } else {

            return router.pushPage(PAGE_MENU);
          }
      }

      if (error.response.status === 500 && error.response.data.message === 'Server error') {
        return console.error(error.response); 
      }

      if (error.response.status === 500 && error.response.data === 'Invalid sign') {
        return console.error(error.response);
      }
    }
  };

  const abortHandle = () => {
    router.popPage();
    return setTimeout(() => setEditMode(false), 100);
  }

  useEffect(() => {
    const launchParams = qs.parse(window.location.search.slice(1));
    // console.log(window.location.search.slice(1));

    if (launchParams.vk_platform === 'desktop_web') setDesktop(true);

    if (launchParams.hasOwnProperty('vk_group_id')) {
      fetchMenu(launchParams);

    } else {
      setStep(STEPS.MAIN);
      router.pushPage(PAGE_INSTALL);
    }
  }, [watchFlag]);
  

  useEffect(() => {
    if (editPosRefs.length !== getPositionSum(group)) {
      setEditPosRefs(editPosRefs => Array(getPositionSum(group)).fill().map((_, i) => editPosRefs[i] || React.createRef()));
    }
  }, [group]);

  const popout = (() => {
    if (location.getPopupId() === POPOUT_EDIT_DELETE_POSITION) {
      return (
        <EditDeletePosition position={position} 
          setEditMode={setEditMode} 
          deletePosition={deletePosition}
          editPosRefs={editPosRefs}
        />
      );
    }
  })();

  if (step === STEPS.LOADER) {
    return (
      <View activePanel={STEPS.LOADER} popout={<ScreenSpinner size='large' />}>
        <Panel id={STEPS.LOADER}>
          {snackbarError}
        </Panel>
      </View>
    );
  }

  return (
    <AppRoot>
      <SplitLayout>
        <SplitCol>
          <Root activeView={location.getViewId()}>
            <View id={VIEW_LENDING} activePanel={location.getViewActivePanel(VIEW_LENDING)}>
              <Install id={PANEL_INSTALL} desktop={desktop}/>
            </View>
            <View id={VIEW_MAIN}
              popout={popout}
              activePanel={location.getViewActivePanel(VIEW_MAIN)}
              modal={
                <ModalRoot activeModal={location.getModalId()} onClose={abortHandle}>
                  <AddEditPosition id={MODAL_PAGE_POSITION}
                    desktop={desktop}
                    group={group}
                    setGroup={setGroup}
                    position={position}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    deletePosition={deletePosition}
                    abortHandle={abortHandle}
                  />
                  <AddEditCategory id={MODAL_CARD_CATEGORY}
                    desktop={desktop}
                    group={group}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    categories={categories}
                    setCategories={setCategories}
                    catOrder={catOrder}
                    setCatOrder={setCatOrder}
                    newCats={newCats}
                    setNewCats={setNewCats}
                    changedCats={changedCats}
                    setChangedCats={setChangedCats}
                    abortHandle={abortHandle}
                  />
                </ModalRoot>
              }
            >
              <Start id={PANEL_START}
                setGroup={setGroup}
                desktop={desktop}
              />
              <FillMenu id={PANEL_FILL_MENU}
                desktop={desktop}
                group={group}
                setGroup={setGroup}
                setPosition={setPosition}
                setCategories={setCategories}
                setCatOrder={setCatOrder}
                editPosRefs={editPosRefs}
              />
              <EditCategories id={PANEL_EDIT_CATEGORIES} desktop={desktop}
                categories={categories}
                setCategories={setCategories}
                catOrder={catOrder}
                setCatOrder={setCatOrder}
                newCats={newCats}
                setNewCats={setNewCats}
                changedCats={changedCats}
                setChangedCats={setChangedCats}
                group={group}
                setGroup={setGroup}
                editMode={editMode}
                setEditMode={setEditMode}
              />
            </View>
            <View id={VIEW_MENU} activePanel={location.getViewActivePanel(VIEW_MENU)}>
              <Menu id={PANEL_MENU}
                group={group}
                desktop={desktop}
                admin={admin}
                groupInfo={groupInfo}
              />
            </View>
          </Root>
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  );
};



export default App;

