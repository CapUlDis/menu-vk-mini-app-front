import { Page, Router } from '@happysanta/router';

export const PAGE_INSTALL = '/';

export const PAGE_START = '/start;';
export const PAGE_FILL_MENU = '/fill_menu';
export const PAGE_EDIT_CATEGORIES = '/edit_categories';

export const PAGE_MENU = '/menu';

export const VIEW_LENDING = 'view_lending';
export const VIEW_MAIN = 'view_main';
export const VIEW_MENU = 'view_menu';

export const PANEL_INSTALL = 'PANEL_INSTALL';
export const PANEL_START = 'PANEL_START';
export const PANEL_FILL_MENU = 'panel_fill_menu';
export const PANEL_EDIT_CATEGORIES = 'panel_edit_categories';

export const PANEL_MENU = 'panel_menu';

export const MODAL_PAGE_POSITION = 'modal_page_position';
export const MODAL_CARD_CATEGORY = 'modal_card_category';

export const POPOUT_EDIT_DELETE_POSITION = 'popout_edit_delete_position';
export const POPOUT_ALERT_DELETE_POSITION = 'popout_alert_delete_position';

const routes = {
	[PAGE_INSTALL]: new Page(PANEL_INSTALL, VIEW_LENDING),
	[PAGE_START]: new Page(PANEL_START, VIEW_MAIN),
	[PAGE_FILL_MENU]: new Page(PANEL_FILL_MENU, VIEW_MAIN),
	[PAGE_EDIT_CATEGORIES]: new Page(PANEL_EDIT_CATEGORIES, VIEW_MAIN),
	[PAGE_MENU]: new Page(PANEL_MENU, VIEW_MENU),
};

export const router = new Router(routes);

router.start();