import { html, htmlstring } from '@services/elements';

const homeTemplate = (
    heading: string,
    welcome: string | null = null
) => {
    welcome = !welcome ? '' : htmlstring`<p>${welcome}</p>`;

    return html`
        <el-home>
            <div class="content-slate">
                <section>
                    <h1>${heading}</h1>
                    ${welcome}
                    <button id="btn"><i class="fa-solid fa-download"></i></button>
                </section>
            </div>
        </el-home>
    `;
}

export default homeTemplate;