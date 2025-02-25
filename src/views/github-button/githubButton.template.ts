import { html, htmlstring } from "@services/elements";

const githubButtonTemplate = (url: string, string: boolean = false) => {
    return string
        ? htmlstring`
            <a class="github-button" href="${url}" target="_blank">
                View on GitHub <i class="fa-brands fa-github"></i>
            </a>
        `
        : html`
            <a class="github-button" href="${url}" target="_blank">
                View on GitHub <i class="fa-brands fa-github"></i>
            </a>
        `;
}

export default githubButtonTemplate;