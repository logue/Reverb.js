import mermaid from 'mermaid';
import type { Preview } from 'storybook-html-rsbuild';

mermaid.initialize({ startOnLoad: false, theme: 'neutral' });

// Storybook renders docs content after DOMContentLoaded, so startOnLoad
// won't find .mermaid elements. Use MutationObserver to detect them instead.
if (typeof window !== 'undefined') {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const runMermaid = () => {
    const nodes = document.querySelectorAll<HTMLElement>('pre.mermaid');
    if (nodes.length > 0) {
      mermaid.run({ nodes: Array.from(nodes) }).catch(() => {});
    }
  };

  const observer = new MutationObserver(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(runMermaid, 50);
  });

  const start = () => {
    observer.observe(document.body, { childList: true, subtree: true });
    runMermaid();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
}

export const preview: Preview = {
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'ja', right: '🇯🇵', title: '日本語' },
          { value: 'en', right: '🇺🇸', title: 'English' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    locale: 'en',
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};
