import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import { BridgePlus, isDesktopPlatform } from "@happysanta/bridge-plus";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import { ConfigProvider, AdaptivityProvider, AppRoot, SplitLayout, SplitCol, WebviewType } from '@vkontakte/vkui';
import { RouterContext } from '@happysanta/router';
import { router } from './router';
import App from "./App";

// Init VK  Mini App
bridge.send("VKWebAppInit");

const mapPlatform = (platform) => {
  switch (platform) {
    case 'desktop_web':
      return 'vkcom';
    case 'mobile_web':
      return 'ios';
    case 'mobile_android':
      return 'android';
    case 'mobiles_ios':
      return 'ios'
  }
};

const platform = BridgePlus.getStartParams().getPlatform();
const isDesktop = isDesktopPlatform();
const uiPlatform = mapPlatform(platform);

ReactDOM.render(
	<RouterContext.Provider value={router}>
		<ConfigProvider isWebView={true}
      platform={uiPlatform}
      webviewType={WebviewType.INTERNAL}
      transitionMotionEnabled={!isDesktop}
    >
			<AdaptivityProvider >
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
