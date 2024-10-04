import { html, htmlstring } from "@services/elements";

const sidebarTemplate = (
    items: { [key: string]: string }
) => {
    const itemsList = Object.keys(items).map((item) => {
        return htmlstring`<li><a href="${item}">${items[item]}</a></li>`;
    });
    return html`
        <el-sidebar>
            <ul>
                ${itemsList.join('')}
            </ul>
        </el-sidebar>`;
    }

export default sidebarTemplate;