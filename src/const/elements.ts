import CookieJar from "../services/cookieJar";
import StorageBox from "../services/storageBox";
import PathNames from "./pathNames";
import { get } from "../services/request";

type FormValues = { [key: string]: string };

export default class El {
    private static getElement = <T extends HTMLElement = HTMLElement>(selector: string) => {
        let el = document.querySelector<T>(selector);
        if (!el) {
            el = document.createElement(selector) as T;
            document.body.appendChild(el);
        }
        return el;
    }
    private static getElements = <T extends HTMLElement = HTMLElement>(selector: string) => {
        let els = document.querySelectorAll<T>(selector);
        if (!els || els.length == 0) {
            console.error(`Nodes with selector "${selector}" not found. Creating new node list.`);
            var el = document.createElement(selector) as T;
            document.body.appendChild(el);
            els = document.querySelectorAll<T>(selector);
            if (!els) throw new Error(`Could not create node list with selector: ${selector}`);
        }
        return els;
    }

    public static get root() {
        return this.getElement(':root');
    } set root(root: HTMLElement) {
        this.root = root;
    }
    public static get body() {
        return this.getElement<HTMLBodyElement>('body');
    } set body(body: HTMLBodyElement) {
        this.body = body;
    }
    public static get title() {
        return this.getElement<HTMLTitleElement>('title');
    } set title(title: HTMLTitleElement) {
        this.title = title;
    }
    public static get inputs() {
        return this.getElements<HTMLInputElement>('input');
    } set inputs(inputs: NodeListOf<HTMLInputElement>) {
        this.inputs = inputs;
    }
    public static get textareas() {
        return this.getElements<HTMLTextAreaElement>('textarea');
    } set textareas(textareas: NodeListOf<HTMLTextAreaElement>) {
        this.textareas = textareas;
    }
    public static get nav() {
        return this.getElement<HTMLElement>('nav');
    } set nav(nav: HTMLElement) {
        this.nav = nav;
    }
    public static csrfToken: string = '';
    public static get modal() {
        return this.getElement<HTMLDivElement>('#modal');
    } set modal(modal: HTMLDivElement) {
        this.modal = modal;
    }
    public static get loader() {
        let loader = document.querySelector('loader');
        if (!loader) {
            let spinner = document.createElement('spinner');
            loader = document.createElement('loader') as HTMLElement;
            loader.appendChild(spinner);
        }
        document.body.appendChild(loader);
        return loader;
    } set loader(loader: HTMLElement) {
        this.loader = loader;
    }
    public static get selectors() {
        return this.getElements<HTMLSelectElement>('select');
    } set selectors(selectors: NodeListOf<HTMLSelectElement>) {
        this.selectors = selectors;
    }
    public static get buttons() {
        return this.getElements<HTMLButtonElement>('button');
    } set buttons(buttons: NodeListOf<HTMLButtonElement>) {
        this.buttons = buttons;
    }
    public static get forms() {
        return this.getElements<HTMLFormElement>('form');
    } set forms(forms: NodeListOf<HTMLFormElement>) {
        this.forms = forms;
    }
    public static get formInputs() {
        return this.getElements<HTMLInputElement | HTMLTextAreaElement>('form input | form textarea');
    } set formInputs(formInputs: NodeListOf<HTMLInputElement | HTMLTextAreaElement>) {
        this.formInputs = formInputs;
    }
    public static get submitButton() {
        return this.getElement<HTMLButtonElement>('button[type="submit"]');
    } set submitButton(submitButton: HTMLButtonElement) {
        this.submitButton = submitButton;
    }
    public static get cookieBanner() {
        return this.getElement<HTMLElement>('cookie-banner');
    } set cookieBanner(cookieBanner: HTMLElement) {
        this.cookieBanner = cookieBanner;
    }
    public static get cookieBannerButton() {
        return this.getElement<HTMLButtonElement>('cookie-banner button');
    } set cookieBannerButton(cookieBannerButton: HTMLButtonElement) {
        this.cookieBannerButton = cookieBannerButton;
    }

    constructor(path: string, private submitted = false) {
        switch (path) {
            case PathNames.HOME:
                // Do something
                break;
            default:
                break;
        }

        if (this.selectors && this.selectors.length > 0) {
            this.selectors.forEach(selector => {
                selector.onclick = (e) => {
                    e.preventDefault();
                    selector.focus();
                };
                [...selector.options].forEach(option => {
                    option.onmousedown = (e) => {
                        e.preventDefault();
                        if (option.value === (e.target as HTMLOptionElement)?.value) {
                            option.selected = !option.selected;
                        }
                    };
                });
            });
        }

        if (this.formInputs && this.submitButton) {
            let requiredInputs = [...this.formInputs].filter(input => input.required);
            let disableSubmitButton = () => {
                if (this.submitButton)
                    this.submitButton.disabled = !requiredInputs.every(input => input.value.trim().length > 0);
            };
            setTimeout(disableSubmitButton, 1000);
            requiredInputs.forEach(input => {
                input.oninput = ((oldOnInput: typeof input.oninput | undefined) => {
                    return (e) => {
                        if (oldOnInput) oldOnInput.call(input, e);
                        disableSubmitButton();
                    };
                })(input.oninput?.bind(input));
            });

            this.forms.forEach(form => {
                form.onsubmit = ((oldOnSubmit: typeof form.onsubmit | undefined) => {
                    form.submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
                    return (e) => {
                        if (oldOnSubmit) oldOnSubmit.call(form, e);
                        form.submitButton.disabled = true;
                        form.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                        this.submitted = true;
                    }
                })(form.onsubmit?.bind(form));
            });
        }

        window.onbeforeunload = ((oldBeforeUnload: typeof window.onbeforeunload | undefined) => {
            return (e) => {
                if (oldBeforeUnload) oldBeforeUnload.call(window, e);
                if (this.formInputs.length == 0) return;
                if (this.submitted) {
                    StorageBox.clear();
                    return;
                }

                let values: {
                    [index: string]: string
                } = {};
                this.formInputs.forEach(input => {
                    if (input && input.name && !input.name.startsWith('_') && input.type !== 'file')
                        values[input.name] = input.value;
                });

                // let content = window.tinymce.get('content')?.getContent() ?? '';
                // let message = window.tinymce.get('message')?.getContent() ?? '';
                // let description = window.tinymce.get('description')?.getContent() ?? '';

                StorageBox.set('formValues', values);
                // StorageBox.set('content', content);
                // StorageBox.set('message', message);
                // StorageBox.set('description', description);
            }
        })(window.onbeforeunload?.bind(window));
        window.onload = ((oldLoad: typeof window.onload | undefined) => {
            return (e) => {
                if (oldLoad) oldLoad.call(window, e);
                if (this.formInputs.length == 0) return;

                let values = StorageBox.get<FormValues>('formValues');
                // let content = StorageBox.get<string>('content');
                // let message = StorageBox.get<string>('message');
                // let description = StorageBox.get<string>('description');

                this.formInputs.forEach(input => {
                    if (input && input.name
                        && !input.name.startsWith('_')
                        && input.type !== 'file'
                        && values && values[input.name]
                    ) input.value = values[input.name];
                });

                // if (content && typeof content === 'string' && content !== '')
                //     window.tinymce.get('content')?.setContent(content);
                // if (message && typeof message === 'string' && message !== '')
                //     window.tinymce.get('message')?.setContent(message);
                // if (description && typeof description === 'string' && description !== '')
                //     window.tinymce.get('description')?.setContent(description);

                localStorage.clear();
            }
        })(window.onload?.bind(window));

        if (this.cookieBanner) {
            if (CookieJar.get<boolean>('cookies-are-cool')) {
                this.cookieBanner.remove();
            }
        };

        if (this.cookieBannerButton) {
            this.cookieBannerButton.onclick = () => {
                CookieJar.set('cookies-are-cool', true, new Date(new Date().getFullYear() + 999, 0).toUTCString());
                if (this.cookieBanner)
                    this.cookieBanner.remove();
            };
        }

        if (document.querySelectorAll('div, body')) {
            (document.querySelectorAll('div, body') as NodeListOf<HTMLDivElement> | NodeListOf<HTMLBodyElement>).forEach((div: HTMLDivElement | HTMLBodyElement) => {
                if (div.getAttribute('bg'))
                    div.style.backgroundImage = `url(${div.getAttribute('bg')})`;
            })
        }
    }
};
