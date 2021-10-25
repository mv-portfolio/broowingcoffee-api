const nodemailer = require('nodemailer');
const {SENDER_EMAIL, SENDER_PASSWORD} = process.env;

class NodeMailer {
  #transporter;
  constructor(config) {
    this.#transporter = nodemailer.createTransport({
      ...this.#config(),
      config,
    });
  }

  async send({to, subject, text, html}) {
    await this.#transporter.sendMail({
      to,
      subject,
      text,
      html,
    });
  }

  template({header, paragraph1, paragraph2, url, buttonText}) {
    return `
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
                  ${header}
                </p>
              </strong>
              <br>
              <p class="message">
                ${paragraph1}
              </p>
              <br>
              <p class="message">
                ${paragraph2}
              </p>
            </div>
            <div class="bottom-pane">
              <a class="reset-password-button" href="${url}">
                ${buttonText}
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>`;
  }

  #config() {
    return {
      pool: true,
      host: 'smtp.gmail.com',
      service: 'gmail',
      port: 526,
      secure: true, // use TLS
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    };
  }
}

module.exports = NodeMailer;
