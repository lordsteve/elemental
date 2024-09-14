import el from '@elements';
import { get, getHtml, initLoader } from '@services/request';

initLoader();
getHtml<NodeListOf<HTMLElement>>('/views/main.html')
    .then((main) => {
        main.forEach((ele) => {
            el.body.appendChild(ele);
        });
        const button = el.buttons.id('btn');
        if (!button) return;

        button.onclick = () => {
            console.log('Hello, World!');
            get('https://jsonplaceholder.typicode.com/posts')
        };
        el.title.textContent = 'Hello, World!';
    });
