import { Platform } from '@vkontakte/vkui';


export default function mapPlatform(platform) {
  switch(true) {
    case platform === 'desktop_web':
      return Platform.VKCOM;
    case platform === 'mobile_web':
      return navigator.userAgent.indexOf('iPhone') > 0 ? Platform.IOS : Platform.ANDROID;
    case platform.includes('iphone'):
      return Platform.IOS;
    default:
      return Platform.ANDROID;
  }
}