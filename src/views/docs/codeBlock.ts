const escape = (source: string) => source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * A code sample for the docs pages. The source is escaped, so it can hold
 * HTML, and highlight.js colors it once the page is on screen.
 */
export default function codeBlock(source: string, language = 'typescript') {
    return `<pre><code class="language-${language}">${escape(source.trim())}</code></pre>`;
}

/** Inline code within a sentence. Also escaped. */
export function inline(source: string) {
    return `<code class="language-plaintext">${escape(source)}</code>`;
}
