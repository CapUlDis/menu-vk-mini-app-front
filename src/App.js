import React, { useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'querystring';
import _ from 'lodash';
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
  MODAL_PAGE_POSITION
} from './router';
import Start from './panels/Start';
import Preset from './panels/Preset';
import FillMenu from './panels/FillMenu';
import AddEditPosition from './modals/AddEditPosition';
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
  const [editMode, setEditMode] = useState(false);

  // useEffect(() => {
  // 	const http = axios.create({
  // 		headers: {
  // 		  	// Прикрепляем заголовок, отвечающий за параметры запуска.
  // 			Authorization: `Bearer ${window.location.search.slice(1)}`,
  // 		},
  // 	});

  // 	console.log(window.location.search.slice(1));
  // 	(async () => {
  // 		// await fetch('http://localhost:3000/auth', {
  // 		// 	headers: { Authorization: `Bearer ${window.location.search.slice(1)}` }
  // 		// });
  // 		await http.get('http://localhost:3000/');
  // 	})();
  // });

  const g = {
    id: 1,
    vkGroupId: 666,
    linkVkFood: null,
    catOrder: [
      1,
      2,
      3
    ],
    createdAt: "2021-02-11T13:05:03.572Z",
    updatedAt: "2021-02-11T13:05:15.817Z",
    Categories: [
      {
        id: 1,
        title: "Суп",
        groupId: 1,
        posOrder: null,
        createdAt: "2021-02-11T13:05:15.808Z",
        updatedAt: "2021-02-11T13:05:15.808Z",
        Positions: []
      },
      {
        id: 2,
        title: "Сок",
        groupId: 1,
        posOrder: null,
        createdAt: "2021-02-11T13:05:15.808Z",
        updatedAt: "2021-02-11T13:05:15.808Z",
        Positions: []
      },
      {
        id: 3,
        title: "Пиво",
        groupId: 1,
        posOrder: null,
        createdAt: "2021-02-11T13:05:15.808Z",
        updatedAt: "2021-02-11T13:05:15.808Z",
        Positions: []
      }
    ]
  }

  const fetchMenu = async () => {
    const response = await API.get('/groups/152694612');
    console.log(response.data.group);
    setGroup(response.data.group);
    router.pushPage(PAGE_FILL_MENU);
  }

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
        activePanel={location.getViewActivePanel(VIEW_MAIN)}
        modal={
          <ModalRoot activeModal={location.getModalId()} onClose={() => router.popPage()}>
            <AddEditPosition id={MODAL_PAGE_POSITION}
              group={group}
              setGroup={setGroup}
              position={position}
              editMode={editMode}
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

