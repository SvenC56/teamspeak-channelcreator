# Teamspeak Channelcreator

[![Build Status](https://drone.sc-web.de/api/badges/SvenC56/teamspeak-channelcreator/status.svg)](https://drone.sc-web.de/SvenC56/teamspeak-channelcreator)

This project automates the process for creating TeamSpeak Channels if needed. It provides a simple user interface to manage the channel manager.

## Getting started

### Small Note

By default this project can be accessed by everybody. This is OK if you have it only running locally but if you deploy it on a server which is accessible from the web you have to make sure that this project is protected (e.g. with Basic Auth)!

### Docker

You can simply pull the provided docker image.

Please add the following environment variables:

```dockerfile
ENV TEAMSPEAK_USERNAME 'serveradmin'
ENV TEAMSPEAK_PASSWORD ''
ENV TEAMSPEAK_HOST 'localhost'
ENV TEAMSPEAK_SERVER_PORT '9987'
ENV TEAMSPEAK_QUERY_PORT '10011'
ENV TEAMSPEAK_PROTOCOL 'raw'
ENV TEAMSPEAK_BOT_NAME 'Bot'
ENV BASE_URL ''
ENV PORT 8080
```

### Installing

1.) Install dependencies:

```bash
$ npm install
```

2.) Configure Environment Variables

Edit the `.env.example` file with your data.

## Running the tests

At the moment no testing is done. This will be a part of future development.

```bash
$ npm run test
```

## Deployment

```bash
$ npm run build

$ npm run serve
```

_or_

```bash
$ npm run start
```

## Built With

- [Node.js](https://nodejs.org/en/)

- [Express](https://expressjs.com/de/) - The Web-Framework

## Authors

- **SvenC56** - [SvenC56](https://github.com/svenc56)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- [TS3-NodeJS-Library](https://github.com/Multivit4min/TS3-NodeJS-Library)
