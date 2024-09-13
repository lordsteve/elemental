export default class Security {
    public static generateCSRFToken = () => {
        console.log('Generating CSRF token.');
        const token = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256).toString(16)).join('');
        // this.setCSRFToken(token);
        return token;
    };

    // public static setCSRFToken = (token: string) => {
    //     document.cookie = `CSRF-TOKEN=${token}; path=/;`;
    // };

    public static getCSRFToken = () => {
        // const cookie = document.cookie.split(';').find(cookie => cookie.includes('CSRF-TOKEN'));
        return this.generateCSRFToken();
    };
}