import { html } from "@services/elements";

const githubButtonTemplate = (url: string) => {
    return html`
        <a class="github-button" href="${url}" target="_blank">
            View on GitHub <i class="fa-brands fa-github">
        </a>
    `;
}

export default githubButtonTemplate;