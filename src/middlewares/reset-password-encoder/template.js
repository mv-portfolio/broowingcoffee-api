const template = ({who, url}) => `
<html>
  <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"
    />
    <style>
      .main-pane {
        height: 72.5vh;
        text-align: center;
        background-color: #282627;
      }
      .main-pane .dev-logo {
        width: 8vh;
        padding: 3vh 0 3vh 0;
        object-fit: contain;
      }

      .main-pane .form-pane {
        width: 40vh;
        height: 57.5vh;
        margin: auto;
        border-radius: 2vh;
        background-color: #fff;
      }

      .form-pane .top-pane {
        margin: auto;
        padding: 4vh 0 4vh 0;
      }
      .top-pane .app-logo {
        margin: auto;
        width: 9vh;
      }

      .form-pane .body-pane {
        padding: 0 0 5vh 0;
      }

      .body-pane .message {
        margin: auto;
        width: 30vh;
        font-size: 1.65vh !important;
        font-weight: bold;
        transform: scaleY(1.2);
        font-family: "consolas";
        color: #282627;
      }

      .form-pane .bottom-pane {
        padding: 2vh 0 5vh 0;
      }

      .bottom-pane .reset-password-button {
        text-decoration: none;
        color: #fff;
        text-align: center;
        font-weight: bold;
        font-family: "consolas";
        font-size: 1.75vh;
        padding: 2vh 3vh 2vh 3vh;
        border-radius: 1.5vh;
        background-color: #f7a35b;
      }
    </style>
  </head>
  <body>
    <div class="main-pane">
      <img
        class="dev-logo"
        src="https://petatemarvin26.github.io/static/media/my-logo.aba1892c.png"
      />
      <div class="form-pane">
        <div class="top-pane">
          <img
            class="app-logo"
            src="https://petatemarvin26.github.io/static/media/broowing-coffee-logo.47aff3b4.png"
          />
        </div>
        <div class="body-pane">
          <strong>
            <p class="message">
              Good day ${who}!
            </p>
          </strong>
          <br>
          <p class="message">
            We notice that you are requesting for password reset, if you wish to performed this
            action, please click the button bellow.
          </p>
          <br>
          <p class="message">
            If you are not requesting for password reset, you can safety ignore
            this email.
          </p>
        </div>
        <div class="bottom-pane">
          <a class="reset-password-button" href="${url}">
            RESET PASSWORD
          </a>
        </div>
      </div>
    </div>
  </body>
</html>
`;
module.exports = template;
