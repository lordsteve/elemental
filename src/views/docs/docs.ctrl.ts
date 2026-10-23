import el from '@elements';
import Helpers from "@services/helpers";
import sidebarTemplate from "@views/sidebar/sidebar.template";

export default function docs() {
    el.title.textContent = "Elemental Documentation";

    const docs = el.docs;

    if (docs) docs.insertBefore(sidebarTemplate({
        "/docs": "Docs",
        "/docs/getting-started": "Getting Started",
        "/docs/elements": "Elements",
        "/docs/views": "Views",
        "/docs/routes": "Routes",
        "/docs/request-service": "Request Service",
        "/docs/the-server": "The Server",
        "/docs/faq": "FAQ",
        "/docs/changelog": "Changelog"
    }), docs.firstChild);

    const section = el.sections ? el.sections[0] : null;
    if (section) {
        addPageLinks(section);
        Helpers.centerSection(section);
        window.addEventListener('resize', () => Helpers.centerSection(section));
    }

    // The page was built after the browser looked for the #section, so go there
    // now, once centering has settled where everything sits
    if (location.hash)
        document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' });
}

/**
 * Puts an "On this page" list under the title, linking to each section. Uses
 * the h2 headings when a page has them (the changelog's dates) and the h4
 * headings otherwise, and gives each heading an id so the links, and URLs
 * like /docs/views#controller, land on it.
 */
function addPageLinks(section: HTMLElement) {
    const h2s = section.querySelectorAll<HTMLElement>(':scope > h2');
    const headings = Array.from(h2s.length ? h2s : section.querySelectorAll<HTMLElement>(':scope > h4'));
    const title = section.querySelector(':scope > h1');
    if (!headings.length || !title) return;

    const used = new Set<string>();
    const list = document.createElement('ul');
    headings.forEach(heading => {
        const text = heading.textContent?.trim() ?? '';
        const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'section';
        let id = base;
        for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
        used.add(id);
        heading.id = id;

        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = text;
        const item = document.createElement('li');
        item.append(link);
        list.append(item);
    });

    const nav = document.createElement('nav');
    nav.className = 'page-links';
    nav.setAttribute('aria-label', 'On this page');
    const label = document.createElement('p');
    label.textContent = 'On this page';
    nav.append(label, list);
    title.after(nav);

}
