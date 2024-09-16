import el from '@elements';
import { getHtml, initLoader } from '@services/request';
import views from '@views';

console.log(location.pathname);
initLoader();
getHtml<HTMLElement>('/views/home')
    .then((home) => {
        el.body.appendChild(home);
        views.home();
    });
