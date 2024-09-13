import el from './const/elements';
import { get, getHtml, initLoader } from './services/request';

initLoader();
getHtml('/views/main.html')
    .then((main) => {
        main.forEach((ele) => {
            el.body.appendChild(ele);
        });
        el.buttons.forEach((button) => {
            button.onclick = () => {
                console.log('Hello, World!');
                get('https://jsonplaceholder.typicode.com/posts')
            };
        });
        el.title.textContent = 'Hello, World!';
    });
