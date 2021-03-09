import React, { useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'querystring';
import _ from 'lodash';
import cloneDeep from 'lodash-es/cloneDeep';
import { SplitLayout, SplitCol, Root, View, Panel, PanelHeader, ScreenSpinner, ModalRoot } from '@vkontakte/vkui';
import { PAGE_MAIN, useLocation, useRouter } from '@happysanta/router';
import '@vkontakte/vkui/dist/vkui.css';

import {
  VIEW_MAIN,
  VIEW_MENU,

  PANEL_START,
  PANEL_PRESET,
  PANEL_FILL_MENU,
  PANEL_EDIT_CATEGORIES,
  PANEL_MENU,
  PAGE_START,
  PAGE_PRESET,
  PAGE_FILL_MENU,
  PAGE_EDIT_CATEGORIES,
  PAGE_MENU,
  MODAL_PAGE_POSITION,
  MODAL_CARD_CATEGORY,
  POPOUT_EDIT_DELETE_POSITION
} from './router';
import Start from './panels/Start';
import Preset from './panels/Preset';
import FillMenu from './panels/FillMenu';
import EditCategories from './panels/EditCategories';
import AddEditPosition from './modals/AddEditPosition';
import AddEditCategory from './modals/AddEditCategory';
import EditDeletePosition from './popouts/EditDeletePosition';
import API from './utils/API';


const STEPS = {
  LOADER: 'loader',
  MAIN: 'main'
};

const App = () => {
  const location = useLocation();
  const router = useRouter();

  const [admin, setAdmin] = useState(false);
  const [step, setStep] = useState(STEPS.LOADER);
  const [snackbarError, setSnackbarError] = useState(null);
  const [group, setGroup] = useState({});
  const [desktop, setDesktop] = useState(false);

  const [position, setPosition] = useState({});
  const [category, setCategory] = useState({});
  const [editMode, setEditMode] = useState(false);
  // EditCategories hooks:
  const [categories, setCategories] = useState({});
  const [catOrder, setCatOrder] = useState([]);
  const [newCats, setNewCats] = useState([]);
  const [changedCats, setChangedCats] = useState([]);

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

  const popout = (() => {
    if (location.getPopupId() === POPOUT_EDIT_DELETE_POSITION) {
      return <EditDeletePosition position={position} setEditMode={setEditMode} deletePosition={deletePosition}/>;
    }
  })();

  const fetchMenu = async () => {
    const response = await API.get('/groups/152694612');
    console.log(response.data.group);
    setGroup(response.data.group);
    
    const cloneGroup = cloneDeep(response.data.group);
    
    setCategories([...cloneGroup.Categories]);
    setCatOrder([...cloneGroup.catOrder]);
    router.pushPage(PAGE_FILL_MENU);
  };

  useEffect(() => {
    const launchParams = qs.parse(window.location.search.slice(1));

    if (launchParams.vk_platform === 'desktop_web') setDesktop(true);

    setStep(STEPS.MAIN);

    if (launchParams.hasOwnProperty('vk_group_id')) {

      if (launchParams.vk_viewer_group_role === 'admin') {
        setAdmin(true);
      }
      router.pushPage(PAGE_MENU);
    } else {
      fetchMenu();
      // setGroup(g);
      // router.pushPage(PAGE_START);
      // router.pushPage(PAGE_PRESET);
      // router.pushPage(PAGE_FILL_MENU);
      // router.pushModal(MODAL_PAGE_POSITION);
    }
  }, [])

  if (step === STEPS.LOADER) {
    return (
      <View activePanel={STEPS.LOADER} popout={<ScreenSpinner size='large' />}>
        <Panel id={STEPS.LOADER}>
          <PanelHeader>
            Loader
					</PanelHeader>
          {snackbarError}
        </Panel>
      </View>
    );
  }

  return (
    <Root activeView={location.getViewId()}>
      <View id={VIEW_MAIN}
        popout={popout}
        activePanel={location.getViewActivePanel(VIEW_MAIN)}
        modal={
          <ModalRoot activeModal={location.getModalId()} onClose={() => {
            router.popPage();
            setEditMode(false);
          }}>
            <AddEditPosition id={MODAL_PAGE_POSITION}
              group={group}
              setGroup={setGroup}
              position={position}
              editMode={editMode}
              setEditMode={setEditMode}
              deletePosition={deletePosition}
            />
            <AddEditCategory id={MODAL_CARD_CATEGORY}
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
            />
          </ModalRoot>
        }
      >
        <Start id={PANEL_START}
          setGroup={setGroup}
        />
        <Preset id={PANEL_PRESET}
          group={group}
          setGroup={setGroup}
        />
        <FillMenu id={PANEL_FILL_MENU}
          desktop={desktop}
          group={group}
          setGroup={setGroup}
          setPosition={setPosition}
          setCategories={setCategories}
          setCatOrder={setCatOrder}
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
        <Panel id={PANEL_MENU}>
          <PanelHeader>
            Menu
					</PanelHeader>
        </Panel>
      </View>
    </Root>
  );
}

export default App;

