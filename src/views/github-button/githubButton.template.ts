import Helpers from "@services/helpers";

const githubButtonTemplate = (url: string, string: boolean = false) => {
    const button = `
        <a class="github-button" href="${url}" target="_blank">
            View on GitHub <i class="fa-brands fa-github"></i>
        </a>
    `;
    return string ? button : Helpers.html`${button}`;
}

export default githubButtonTemplate;