import { Page, Router } from '@happysanta/router';

export const PAGE_START = '/';
export const PAGE_PRESET = '/preset;';
export const PAGE_FILL_MENU = '/fill_menu';
export const PAGE_EDIT_CATEGORIES = '/edit_categories';
export const PAGE_ADD_EDIT_POSITION = '/add_edit_position';

export const PAGE_MENU = '/menu';

export const VIEW_MAIN = 'view_main';
export const VIEW_MENU = 'view_menu';

export const PANEL_START = 'panel_start';
export const PANEL_PRESET = 'panel_preset';
export const PANEL_FILL_MENU = 'panel_fill_menu';
export const PANEL_EDIT_CATEGORIES = 'panel_edit_categories';
export const PANEL_ADD_EDIT_POSITION = 'panel_add_edit_position';

export const PANEL_MENU = 'panel_menu';

const routes = {
    [PAGE_START]: new Page(PANEL_START, VIEW_MAIN),
    [PAGE_PRESET]: new Page(PANEL_PRESET, VIEW_MAIN),
    [PAGE_FILL_MENU]: new Page(PANEL_FILL_MENU, VIEW_MAIN),
    [PAGE_EDIT_CATEGORIES]: new Page(PANEL_EDIT_CATEGORIES, VIEW_MAIN),
    [PAGE_ADD_EDIT_POSITION]: new Page(PANEL_ADD_EDIT_POSITION, VIEW_MAIN),
    [PAGE_MENU]: new Page(PANEL_MENU, VIEW_MENU),
};

export const router = new Router(routes);

router.start();