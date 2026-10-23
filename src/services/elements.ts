import BaseEl from "./baseElements";

/**
 * The elements specific to this app. BaseEl has everything that comes with
 * Elemental; add a getter here for each view you make.
 */
export default class el extends BaseEl {
    public static get cookieBannerButton() {
        return this.getElement<HTMLButtonElement>('el-cookie-banner button');
    }
    public static get home() {
        return this.getElement<HTMLElement>('el-home');
    }
    public static get about() {
        return this.getElement<HTMLElement>('el-about');
    }
    public static get docs() {
        return this.getElement<HTMLElement>('el-docs');
    }
};
