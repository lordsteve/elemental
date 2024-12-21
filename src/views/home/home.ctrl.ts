import el from '@services/elements';
import { get } from '@services/request';
import sidebarTemplate from '@views/sidebar/sidebar.template';

export default function home() {
    el.title.textContent = 'Welcome to Elemental!';

    const button = el.buttons?.id('btn');
    const home = el.home;

    if (home) home.insertBefore(sidebarTemplate({
        '/': 'Home',
        '/about': 'About',
        '/docs': 'Docs'
    }), home.firstChild);

    if (button) button.onclick = () => {
        get('https://jsonplaceholder.typicode.com/posts')
    };
}