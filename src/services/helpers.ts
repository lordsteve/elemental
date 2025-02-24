export default class Helpers {
    static centerSection(section: HTMLElement) {
        // this is to compensate for some weird css flex behavior
        const parent = section.parentElement;
        if (!parent) return;
        const rect = section.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        const distance = rect.bottom - parentRect.bottom;
        if (distance < 0) section.style.marginTop = `${(parentRect.height / 2) - (rect.height / 2)}px`;
    }
}