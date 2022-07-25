import { LitElement, css, html } from 'lit';
import {  customElement } from 'lit/decorators.js';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';

@customElement('app-room')
export class AppHome extends LitElement {
    static get styles() {
        return css`
          #mainContainer {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          }
        `
    }

    render() {
        return html`
          <div>
            <div id="mainContainer">
              <app-header></app-header>
              <app-copy-area></app-copy-area>
            </div>
          </div>
        `;
      }


}