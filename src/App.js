import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SplitLayout, SplitCol, Root, View, Panel, PanelHeader } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';



const App = () => {
	const [activeView, setActiveView] = useState(null);

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

	return (
		<SplitLayout>
			<SplitCol>
				<Root activeView={activeView}>
					<View id='test' activePanel='test'>
						<Panel id='test'>
							<PanelHeader>
								Test
							</PanelHeader>
						</Panel>
					</View>
				</Root>
			</SplitCol>
		</SplitLayout>
	);
}

export default App;

