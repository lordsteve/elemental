import views from "@views";
import Helpers from "@services/helpers";
import { currentTheme } from "@services/theme";

const html = Helpers.html;

const navTemplate = () => html`
    <nav>${views.githubButtonTemplate('https://github.com/lordsteve/elemental', true)}
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/docs">Docs</a></li>
            <li>
                <button id="theme-toggle" title="${currentTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}">
                    <i class="fa-solid ${currentTheme() === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
                </button>
            </li>
        </ul>
    </nav>
`;

export default navTemplate;
