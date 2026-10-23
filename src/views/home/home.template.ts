import Helpers from '@services/helpers';
import sidebarTemplate from '@views/sidebar/sidebar.template';

const homeTemplate = (
    heading: string,
    welcome: string | null = null
) => {
    welcome = !welcome ? '' : `<p>${welcome}</p>`;
    const sidebar = sidebarTemplate({
        '/':'Home',
        '/about':'About',
        '/docs':'Docs',
        '/contact':'Contact'
    }).outerHTML;

    return Helpers.html`
        <el-home>
            ${sidebar}
            <div class="content-slate">
                <section>
                    <h1>${heading}</h1>
                    ${welcome}
                </section>
            </div>
        </el-home>
    `;
}

export default homeTemplate;