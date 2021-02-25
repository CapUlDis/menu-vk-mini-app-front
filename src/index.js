import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import { ConfigProvider, AdaptivityProvider, AppRoot, SplitLayout, SplitCol } from '@vkontakte/vkui';
import { RouterContext } from '@happysanta/router';
import { router } from './router';
import App from "./App";

// Init VK  Mini App
bridge.send("VKWebAppInit");

ReactDOM.render(
	<RouterContext.Provider value={router}>
		<ConfigProvider isWebView={true}>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout>
						<SplitCol>
							<App />
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	</RouterContext.Provider>, document.getElementById("root")
);

if (process.env.NODE_ENV === "development") {
	import("./eruda").then(({ default: eruda }) => { }); //runtime download
}
