import { LitElement, html } from 'lit';
import {  customElement } from 'lit/decorators.js';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';

@customElement('app-copy-area')
export class AppHome extends LitElement {

    render() {
        return html`
          <textarea>

          </textarea>
        `;
      }
}