import el from "@services/elements";
import githubButtonTemplate from "@views/github-button/githubButton.template";

export default function nav() {
    el.body.appendChild(githubButtonTemplate('https://github.com/lordsteve/elemental'));
}