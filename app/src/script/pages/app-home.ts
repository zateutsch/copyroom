import { LitElement, css, html } from 'lit';
import {  customElement } from 'lit/decorators.js';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';

@customElement('app-home')
export class AppHome extends LitElement {

  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/

  static get styles() {
    return css`
      #mainContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }

      button {
        font-family: upheaval;
        padding: 20px;
        background-color: #ffb6c1;
        margin: 5px;
        border-radius: 5px;
        font-size: min(3.5vw, 25px);
        border-color: #ffb6c1;
        color: white;
      }

      #topButton {
        margin-top: 30px;
      }

      h2 {
        font-family: "bubble";
        color: white;
        font-size: min(3.5vw, 25px);
        text-align: center;
      }

      @media (horizontal-viewport-segments: 2) {
        #welcomeBar {
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }

      }

    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/
    console.log('This is your home page');

    const ws = new WebSocket('ws://localhost:8999/open-room');

    const btn = this.renderRoot.querySelector('sl-button');
    console.log(btn);
    btn?.addEventListener('click', () => {
      console.log("yeah");
      ws.send('hello');
    });
  }

  share() {
    if ((navigator as any).share) {
      (navigator as any).share({
        title: 'PWABuilder pwa-starter',
        text: 'Check out the PWABuilder pwa-starter!',
        url: 'https://github.com/pwa-builder/pwa-starter',
      });
    }
  }

  render() {
    return html`
      <div>
        <div id="mainContainer">
          <app-header></app-header>
          <h2>
            A login-free and cross-platform shared clipboard.
          </h2>
            <a href="/room/HZFC"> <button id="topButton" > Create A New CopyRoom </button> </a>
            <button> Join An Existing CopyRoom </button>
        </div>
      </div>
    `;
  }
}
