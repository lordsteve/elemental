import Helpers from "@services/helpers";

const html = Helpers.html;

/**
 * 
 * @param items an array using a string key as a path and a string value as the name of the item
 * @returns a sidebar element with a list of items
 */
const sidebarTemplate = (
    items: { [key: string]: string }
) => {
    const itemsList = Object.keys(items).map((item) => {
        return `<li><a href="${item}">${items[item]}</a></li>`;
    });
    return html`
        <el-sidebar>
            <ul>
                ${itemsList.join('')}
            </ul>
        </el-sidebar>
    `;
}

export default sidebarTemplate;