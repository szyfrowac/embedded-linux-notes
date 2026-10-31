// Draws ```mermaid fences as diagrams in the browser. Expressive Code renders
// them as ordinary code blocks first; each one is swapped for a diagram
// container here, so the source stays readable if scripts are off.
// Renders are queued: overlapping mermaid.render() calls corrupt each other's
// text measurement and leave the labels empty. Diagrams redraw on theme change.
const blocks = [...document.querySelectorAll<HTMLElement>('pre[data-language="mermaid"]')].map((pre) => {
  const box = document.createElement('div');
  box.className = 'mermaid not-content';
  box.dataset.src = pre.querySelector('code')?.innerText ?? '';
  (pre.closest('.expressive-code') ?? pre).replaceWith(box);
  return box;
});

if (blocks.length) {
  let queue = Promise.resolve();
  let run = 0;

  const draw = () => {
    const id = ++run;
    queue = queue.then(async () => {
      const { default: mermaid } = await import('mermaid');
      const dark = document.documentElement.dataset.theme !== 'light';
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: dark ? 'dark' : 'neutral',
        fontFamily: "'Source Sans 3', system-ui, sans-serif",
      });
      for (const [i, el] of blocks.entries()) {
        if (id !== run) return; // a newer theme change superseded this pass
        try {
          const { svg } = await mermaid.render(`fd-mermaid-${id}-${i}`, el.dataset.src!);
          el.innerHTML = svg;
        } catch (e) {
          el.textContent = `Diagram could not be drawn: ${(e as Error).message}`;
        }
      }
    });
  };

  draw();
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
