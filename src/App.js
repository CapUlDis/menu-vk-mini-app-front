import React, { useEffect } from 'react';
import { SplitLayout, SplitCol, Root, View, Panel, PanelHeader } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';


const App = () => {

	useEffect(() => {
		console.log(window.location.search.slice(1))
	});

	return (
		<SplitLayout>
			<SplitCol>
				<Root activeView='test'>
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

