export const insertNode = {
  before: <Element extends HTMLElement>(
    container: HTMLElement,
    node: Element,
    before?: HTMLElement | null,
  ): Element => {
    if (before)
      return container.insertBefore(node, before);

    container.prepend(node);

    return node;
  },
  after: <Element extends HTMLElement>(
    container: HTMLElement,
    node: Element,
    after?: HTMLElement | null,
  ): Element => {
    const nextSibling = after?.nextSibling;

    if (nextSibling)
      return container.insertBefore(node, nextSibling);

    return container.appendChild(node);
  },
};