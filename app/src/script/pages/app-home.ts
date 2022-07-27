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


  createNewButtonClick() {
    const ws = new WebSocket('ws://localhost:8999/open-room');

    ws.addEventListener("message", (event) => {
      var messageObject = JSON.parse(event.data.toString());
      if(messageObject.type === "roomCode") {
        ws.close();
        window.location.href = window.location.href + "room/" + messageObject.message;
      }
    });


  }

  async firstUpdated() {



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
            <button id="topButton" @click=${this.createNewButtonClick}> Create A New CopyRoom </button>
            <button> Join An Existing CopyRoom </button>
        </div>
      </div>
    `;
  }
}
