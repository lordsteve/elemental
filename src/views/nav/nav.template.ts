import { html } from "@services/elements";
import githubButtonTemplate from "@views/github-button/githubButton.template";

console.log(githubButtonTemplate('https://github.com/lordsteve/elemental', true));


const navTemplate = () => html`
    <nav>${githubButtonTemplate('https://github.com/lordsteve/elemental', true)}
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/docs">Docs</a></li>
        </ul>
    </nav>
`;

export default navTemplate;