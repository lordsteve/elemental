import el from "@services/elements";
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
        "/docs/faq": "FAQ"
    }), docs.firstChild);
}