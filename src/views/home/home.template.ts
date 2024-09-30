import { html, htmlstring } from '@const/elements';

const homeTemplate = (
    welcome: string | null = null
) => html`
<main>
    <h1>Hello World!</h1>
    ${
        welcome
        ? htmlstring`<p>${welcome}</p>`
        : ''
    }
    <button id="btn"><i class="fa-solid fa-download"></i></button>
</main>`;

export default homeTemplate;