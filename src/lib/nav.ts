export type NavIconName = 'home' | 'services' | 'projects' | 'about' | 'contact' | 'phone';

export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: NavIconName;
}

/**
 * Shared navigation configuration used by both Banner (homepage) and
 * ServiceNav (service/project pages). Keeping the items in one place means
 * adding, removing, or renaming a nav link only requires one edit.
 *
 * hrefs use the `/`-prefixed form (e.g. `/#services`) which works correctly
 * whether the user is already on the homepage or navigating from a
 * service/project page.
 */
export const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: 'Home', href: '/#home', icon: 'home' },
    { id: 'services', label: 'Services', href: '/#services', icon: 'services' },
    { id: 'projects', label: 'Gallery', href: '/#projects', icon: 'projects' },
    { id: 'about', label: 'About', href: '/#about', icon: 'about' },
    { id: 'contact', label: 'Contact', href: '/#contact', icon: 'contact' },
];
