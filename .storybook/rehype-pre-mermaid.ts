/**
 * Lightweight rehype plugin that transforms Mermaid code blocks
 * into <pre class="mermaid"> elements for client-side rendering.
 *
 * Replaces rehype-mermaid (which pulls in Playwright as a dependency)
 * when only the pre-mermaid strategy is needed.
 */
import type { Element, Root, Text } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const rehypePreMermaid: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName !== 'pre') return;

    const code = node.children[0];
    if (code?.type !== 'element' || code.tagName !== 'code') return;

    const cls = code.properties?.className as string[] | undefined;
    if (!cls?.includes('language-mermaid')) return;

    // Replace <pre><code class="language-mermaid">...</code></pre>
    // with    <pre class="mermaid">...</pre>
    node.properties = {
      class: 'mermaid',
    };
    node.children = code.children.filter((c): c is Text => c.type === 'text');
  });
};

export default rehypePreMermaid;
