import { LitElement, css, html } from 'lit';
import {  customElement, property } from 'lit/decorators.js';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';

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
            background-color: linear-gradient(to right, #F2F0F4, #F2FBFD);
            background-color: #ffb6c1;
            width: min(1200px, 60vw);
            height: min(800px, 40vh);
            resize: none;
            border-radius: 5px;
            font-size: 18px;
            border-color: #ffb6c1;
            margin-top: 50px;
            padding: 15px;
          }

          textarea:focus {
              outline: none;
          }
        `
    }

    firstUpdated() {
      const textArea = this.renderRoot.querySelector('textarea') as HTMLTextAreaElement;
      const location = window.location.href;
      const roomCode = location.substring(location.length - 4);
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
        }
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
            </div>
          </div>
        `;
      }


}