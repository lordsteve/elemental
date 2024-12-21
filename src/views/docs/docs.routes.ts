import el, { html } from '@services/elements';
import views from '@views';
import Routes from '@routes';

export default class DocsRoutes extends Routes {
    constructor(public path: string[]) {
        super(path);
    }

    ['getting-started']() {
        el.body.appendChild(
            views.docsTemplate.gettingStarted()
        );
        views.docs();
    }

    ['elements']() {
        el.body.appendChild(
            views.docsTemplate.elementsTemplate()
        );
        views.docs();
    }

    ['services']() {
        // el.body.appendChild(
        //     views.docsTemplate.servicesTemplate
        // );
        views.docs();
    }

    ['views']() {
        el.body.appendChild(
            views.docsTemplate.viewsTemplate()
        );
        views.docs();
    }

    ['faq']() {
        // el.body.appendChild(
        //     views.docsTemplate.faqTemplate
        // );
        views.docs();
    }
}