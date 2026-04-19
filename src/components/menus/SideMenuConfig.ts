import { TRANSLATION_KEYS } from '../../constants/translationKeys';

/**
 * Side Menu Configuration
 * Defines the structure and translation keys for menu sections and items
 */

export interface MenuItemConfig {
  id: string;
  labelKey: string;
  icon: string;
}

export interface MenuSectionConfig {
  id: string;
  titleKey: string;
  icon: string;
  items: MenuItemConfig[];
}

export const SIDE_MENU_CONFIG: MenuSectionConfig[] = [
  {
    id: 'pages',
    titleKey: TRANSLATION_KEYS.SIDESCROLLER.PAGES,
    icon: 'book',
    items: [
      {
        id: 'explore',
        labelKey: TRANSLATION_KEYS.SIDESCROLLER.PAGES_ITEMS.EXPLORE,
        icon: 'map-pin',
      },
      {
        id: 'bookings',
        labelKey: TRANSLATION_KEYS.SIDESCROLLER.PAGES_ITEMS.BOOKINGS,
        icon: 'calendar',
      },
      {
        id: 'activity',
        labelKey: TRANSLATION_KEYS.SIDESCROLLER.PAGES_ITEMS.ACTIVITY,
        icon: 'align-left',
      },
      {
        id: 'tours',
        labelKey: TRANSLATION_KEYS.SIDESCROLLER.PAGES_ITEMS.TOURS,
        icon: 'compass',
      },
    ],
  },
  {
    id: 'quick-actions',
    titleKey: TRANSLATION_KEYS.SIDESCROLLER.QUICK_ACTIONS,
    icon: 'zap',
    items: [
      {
        id: 'scan-qr',
        labelKey: TRANSLATION_KEYS.SIDESCROLLER.QUICK_ITEMS.SCAN_QR,
        icon: 'camera',
      },
      {
        id: 'wallet',
        labelKey: TRANSLATION_KEYS.SIDESCROLLER.QUICK_ITEMS.WALLET,
        icon: 'credit-card',
      },
      {
        id: 'payment',
        labelKey: TRANSLATION_KEYS.SIDESCROLLER.QUICK_ITEMS.PAYMENT,
        icon: 'dollar-sign',
      },
      {
        id: 'track',
        labelKey: TRANSLATION_KEYS.SIDESCROLLER.QUICK_ITEMS.TRACK,
        icon: 'navigation',
      },
    ],
  },
  {
    id: 'general',
    titleKey: TRANSLATION_KEYS.SIDESCROLLER.GENERAL,
    icon: 'settings',
    items: [
      {
        id: 'profile',
        labelKey: TRANSLATION_KEYS.SIDESCROLLER.GENERAL_ITEMS.PROFILE,
        icon: 'user',
      },
      {
        id: 'settings',
        labelKey: TRANSLATION_KEYS.SIDESCROLLER.GENERAL_ITEMS.SETTINGS,
        icon: 'settings',
      },
      {
        id: 'help',
        labelKey: TRANSLATION_KEYS.SIDESCROLLER.GENERAL_ITEMS.HELP,
        icon: 'help-circle',
      },
      {
        id: 'about',
        labelKey: TRANSLATION_KEYS.SIDESCROLLER.GENERAL_ITEMS.ABOUT,
        icon: 'info',
      },
      {
        id: 'logout',
        labelKey: TRANSLATION_KEYS.SIDESCROLLER.GENERAL_ITEMS.LOGOUT,
        icon: 'log-out',
      },
    ],
  },
];
