export function mermaidPlugin(md) {
  const defaultFence = md.renderer.rules.fence ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const { info, content } = tokens[idx];

    if (info.trim() === 'mermaid') {
      try {
        return `<pre class="mermaid">${content}</pre>`;
      } catch (err) {
        return `<pre class="mermaid-error">${err.toString()}</pre>`;
      }
    }
    return defaultFence(tokens, idx, options, env, self);
  };
}