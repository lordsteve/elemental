import Helpers from '@services/helpers';
import elementsTemplate from './elements/elements.template';
import gettingStartedTemplate from './gettingStarted/gettingStarted.template';
import requestServiceTemplate from './requestService/requestService.template';
import routesTemplate from './routes/routes.template';
import theServer from './theServer/theServer.template';
import viewsTemplate from './views/views.template';
import faqTemplate from './faq/faq.template';

const docsTemplate = () => Helpers.html`
        <el-docs>
            <div class="content-slate">
                <section>
                    <h1>Documentation</h1>
                    <p>
                        Elemental was created with the purpose of using as few different languages as possible for a full-stack application development platform. It needed to have all the functionality given by JavaScript, HTML and CSS, and a fully functional backend. For this reason I've decided to use TypeScript with a Node.js backend. With TypeScript we can build a fully functional server with type checking and use the same syntax and functionality in the front end.
                    </p>
                    <p>
                        This documentation will cover how Elemental works and how to use it to build your own applications: the framework itself, the services that come with it, how to build views and route to them, and the server behind it all, including the database.
                    </p>
                    <ul>
                        <li><a href="/docs/getting-started">Getting Started</a></li>
                        <li><a href="/docs/elements">Elements</a></li>
                        <li><a href="/docs/views">Views</a></li>
                        <li><a href="/docs/routes">Routes</a></li>
                        <li><a href="/docs/request-service">Request Service</a></li>
                        <li><a href="/docs/the-server">The Server</a></li>
                        <li><a href="/docs/faq">FAQ</a></li>
                    </ul>
                </section>
            </div>
        </el-docs>
    `;
docsTemplate.gettingStarted = gettingStartedTemplate;
docsTemplate.elementsTemplate = elementsTemplate;
docsTemplate.viewsTemplate = viewsTemplate;
docsTemplate.routesTemplate = routesTemplate;
docsTemplate.requestServiceTemplate = requestServiceTemplate;
docsTemplate.theServer = theServer;
docsTemplate.faqTemplate = faqTemplate;
export default docsTemplate;