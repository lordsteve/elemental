import el from '@elements';
import { currentTheme, followSystemTheme, setTheme, Theme } from '@services/theme';

export default function nav() {
    const themeToggle = el.buttons.id('theme-toggle');
    if (themeToggle) {
        // Replaced rather than re-classed: the Font Awesome kit may have swapped the <i> for an <svg>
        const showTheme = (theme: Theme) => {
            themeToggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
            themeToggle.innerHTML = `<i class="fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>`;
        };
        themeToggle.addEventListener('click', () => {
            setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
            showTheme(currentTheme());
        }, { signal: el.signal });
        followSystemTheme(showTheme);
    }
}
