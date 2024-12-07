import el from '@services/elements';
import { get } from '@services/request';

export default function home() {
    const button = el.buttons?.id('btn');

    if (button)
        button.onclick = () => {
            get('https://jsonplaceholder.typicode.com/posts')
        };
    el.title.textContent = 'Welcome to Elemental!';
}