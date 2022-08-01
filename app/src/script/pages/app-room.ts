import { LitElement, css, html } from 'lit';
import {  customElement, property } from 'lit/decorators.js';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';

const location = window.location.href;
const roomCode = location.substring(location.length - 4);

@customElement('app-room')
export class AppHome extends LitElement {

    @property()
    textareaPlaceholder: string = "Enter some text here...";

    static get styles() {
        return css`
          #mainContainer {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          }

          textarea {
            background-image: linear-gradient(to top, #FFD1D8, 40%, #FF98A8);
            background-color: #ffb6c1;
            width: min(1200px, 60vw);
            height: min(800px, 40vh);
            resize: none;
            border-radius: 5px;
            font-size: 18px;
            border-color: #ffb6c1;
            margin-top: 25px;
            padding: 15px;
          }

          h2 {
            font-family: upheaval;
            color: white;
            font-size: min(3.5vw, 55px);
            text-align: center;
            margin-left: 10px
          }

          textarea:focus {
              outline: none;
          }

          sl-card {
            margin-top: 20px;
          }
          sl-card::part(body) {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
            background-image: linear-gradient(to top, #FFD1D8, 40%, #FF98A8);
          }

        `
    }

    firstUpdated() {
      const textArea = this.renderRoot.querySelector('textarea') as HTMLTextAreaElement;
      const ws = new WebSocket("ws://localhost:8999/" + roomCode);

      ws.addEventListener('message', (event) => {
        var messageObject = JSON.parse(event.data.toString());
        if(messageObject.type === "serverUpdate") {
          textArea.value = messageObject.message;
        } else if(messageObject.type === "serverRequestUpdate") {
          ws.send(JSON.stringify({
            type: "clientUpdate",
            message: textArea.value
          }));
        } else if(messageObject.type === "404") {
          ws.close();
          window.location.href = "/error";
        } else if(messageObject.type === "close") {
          ws.close();
          window.location.href = "/error";
        }
      });

      ws.addEventListener('close', () => {
        window.location.href = "/error";
      });

      textArea.addEventListener('input', () => {
        ws.send(JSON.stringify({
          type: "clientUpdate",
          message: textArea.value
        }));
      });

      setTimeout(() => {ws.send(JSON.stringify({
        type: "clientRequestUpdate",
        message: ""
      }))}, 1000);

    }

    render() {
        return html`
          <div>
            <div id="mainContainer">
              <app-header></app-header>

              <textarea placeholder=${this.textareaPlaceholder}></textarea>

              <sl-card>
                  <sl-qr-code value=${location}></sl-qr-code>
                  <h2>${roomCode}</h2>
              </sl-card>
            </div>
          </div>
        `;
      }


}