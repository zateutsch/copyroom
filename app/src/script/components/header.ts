import { LitElement, css, html } from 'lit';
import {  customElement } from 'lit/decorators.js';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';

@customElement('app-header')
export class AppHome extends LitElement {
    static get styles() {
        return css`
          h1 {
            font-family: "bubble";
            font-size: min(10vw, 100px);

            color: white;
            margin-bottom: 0px;
          }

          a {
              text-decoration: none;
          }
        `
    }

    render() {
        return html`
          <a href="/">
            <h1 >
              CopyRoom
            </h1>
          </a>
        `
    }
}