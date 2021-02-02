import React, { useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'querystring';
import _ from 'lodash';
import { SplitLayout, SplitCol, Root, View, Panel, PanelHeader, ScreenSpinner } from '@vkontakte/vkui';
import { PAGE_MAIN, useLocation, useRouter } from '@happysanta/router';
import '@vkontakte/vkui/dist/vkui.css';

import {
	VIEW_MAIN,
	VIEW_MENU,

	PANEL_START,
	PANEL_PRESET,
	PANEL_FILL_MENU,
	PANEL_EDIT_CATEGORIES,
	PANEL_ADD_EDIT_POSITION,
	PANEL_MENU,

	PAGE_START,
	PAGE_PRESET,
	PAGE_FILL_MENU,
	PAGE_EDIT_CATEGORIES,
	PAGE_ADD_EDIT_POSITION,
	PAGE_MENU,
} from './router';
import Start from './panels/Start';
import Preset from './panels/Preset';


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
	const [group, setGroup] = useState(false);

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

	useEffect(() => {
		const launchParams = qs.parse(window.location.search.slice(1));
		console.log(launchParams);
		setStep(STEPS.MAIN);

		if (launchParams.hasOwnProperty('vk_group_id')) {
			// cloneMenuInfo.groupID = launchParams.vk_group_id;
			// setMenuInfo(cloneMenuInfo);
			
			if (launchParams.vk_viewer_group_role === 'admin') {
				setAdmin(true);
			}
			router.pushPage(PAGE_MENU);
		} else {
			router.pushPage(PAGE_START);
			// router.pushPage(PAGE_PRESET);
		}
	}, [])

	if (step === STEPS.LOADER) {
		return (
			<View activePanel={STEPS.LOADER} popout={<ScreenSpinner size='large'/>}>
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
			<View id={VIEW_MAIN} activePanel={location.getViewActivePanel(VIEW_MAIN)}>
				{/* <Panel id={PANEL_START}>
					<PanelHeader>
						Main
					</PanelHeader>
				</Panel> */}
				<Start id={PANEL_START} setGroup={setGroup}/>
				<Preset id={PANEL_PRESET} group={group}/>
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

