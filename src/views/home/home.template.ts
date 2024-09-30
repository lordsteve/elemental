import { html, htmlstring } from '@const/elements';

const homeTemplate = (
    welcome: string | null = null
) => {
    welcome = !welcome ? '' : htmlstring`<p>${welcome}</p>`;
    
    return html`
    <main>
        <h1>Hello World!</h1>
        ${welcome}
        <button id="btn"><i class="fa-solid fa-download"></i></button>
    </main>`;
}

export default homeTemplate;