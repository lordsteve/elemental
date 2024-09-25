import el from '@elements';
import { getHtml, initLoader } from '@services/request';
import views from '@views';

initLoader();

switch (location.pathname) {
    case '/':
        getHtml<HTMLElement>('/views/nav')
            .then((nav) => {
                el.body.appendChild(nav);
                views.nav();
            }).then(() =>
            getHtml<HTMLElement>('/views/home')
                .then((home) => {
                    el.body.appendChild(home);
                    views.home();
                }));
    break;
    default:
        getHtml<HTMLElement>(location.pathname)
            .then((page) => {
                el.body.appendChild(page);
            });
    break;
}
