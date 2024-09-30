import home from '@views/home/home';
import homeTemplate from '@views/home/home.template';
import nav from '@views/nav/nav';
import navTemplate from '@views/nav/nav.template';

export { default as home } from '@views/home/home';
export { default as homeTemplate } from '@views/home/home.template';
export { default as nav } from '@views/nav/nav';
export { default as navTemplate } from '@views/nav/nav.template';

const views = {
    home,
    homeTemplate,
    nav,
    navTemplate
};
export default views;