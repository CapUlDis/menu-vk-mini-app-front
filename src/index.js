import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import { BridgePlus } from "@happysanta/bridge-plus";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import { ConfigProvider, AdaptivityProvider, WebviewType, SizeType, VKCOM, ViewWidth } from '@vkontakte/vkui';
import { RouterContext } from '@happysanta/router';
import { router } from './router';
import App from "./App";
import mapPlatform from "./utils/mapPlatform";

// Init VK  Mini App
bridge.send("VKWebAppInit");

const uiPlatform = mapPlatform(BridgePlus.getStartParams().getPlatform());
const isDesktop = BridgePlus.getStartParams().isDesktop();

bridge.subscribe(({ detail: { type, data }}) => {
  if (type === 'VKWebAppUpdateConfig' && !isDesktop) {
    let scheme = (data.scheme === 'client_dark' || data.scheme === 'space_gray')
      ? 'space_gray'
      : 'bright_light';
    
    document.querySelector('body').setAttribute('scheme', scheme);

    let status_bar_style = 'dark';
    let action_bar_color = '#FFFFFF';

    if (scheme === 'space_gray') {
      status_bar_style = 'light';
      action_bar_color = '#19191A';
    }

    if (bridge.supports('VKWebAppSetViewSettings')) {
      bridge.send('VKWebAppSetViewSettings', {
        status_bar_style,
        action_bar_color
      });
    }
  }
});

ReactDOM.render(
	<RouterContext.Provider value={router}>
		<ConfigProvider isWebView={true}
      platform={uiPlatform}
      webviewType={WebviewType.INTERNAL}
      transitionMotionEnabled={!isDesktop}
    >
			<AdaptivityProvider 
        sizeX={uiPlatform === VKCOM ? SizeType.REGULAR : undefined}
        viewWidth={uiPlatform === VKCOM ? ViewWidth.DESKTOP : undefined}
      >
        <App />
			</AdaptivityProvider>
		</ConfigProvider>
	</RouterContext.Provider>, document.getElementById("root")
);

if (process.env.NODE_ENV === "development") {
	import("./eruda").then(({ default: eruda }) => { }); //runtime download
}
