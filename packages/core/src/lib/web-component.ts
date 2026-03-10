const ELEMENT_TAG = 'onlyoffice-editor';

export class OnlyOfficeEditorElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['src'];
  }

  private shadow: ShadowRoot;
  private iframe: HTMLIFrameElement | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.render();
  }

  disconnectedCallback(): void {
    this.iframe?.remove();
    this.iframe = null;
  }

  attributeChangedCallback(): void {
    this.render();
  }

  private render(): void {
    const src = this.getAttribute('src');
    if (!src) return;

    if (!this.iframe) {
      this.iframe = document.createElement('iframe');
      this.iframe.style.width = '100%';
      this.iframe.style.height = '100%';
      this.iframe.style.border = 'none';
      this.shadow.appendChild(this.iframe);
    }

    this.iframe.src = src;
  }
}

export function registerWebComponent(): void {
  if (!customElements.get(ELEMENT_TAG)) {
    customElements.define(ELEMENT_TAG, OnlyOfficeEditorElement);
  }
}
