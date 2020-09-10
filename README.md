# TeamSpeak Channelcreator

[![Build Status](https://drone.sc-web.de/api/badges/SvenC56/teamspeak-channelcreator/status.svg)](https://drone.sc-web.de/SvenC56/teamspeak-channelcreator)

This project automates the process for creating TeamSpeak Channels if needed. It provides a simple user interface to manage the channel manager.

## Getting started

### Small Note

By default this project can be accessed by everybody. This is OK if you have it only running locally but if you deploy it on a server which is accessible from the web you have to make sure that this project is protected (e.g. with Basic Auth)!

### Docker

You can simply pull the provided docker image.

[svenc56/teamspeak-channelcreator](https://hub.docker.com/r/svenc56/teamspeak-channelcreator)

Please add the following environment variables depending on your setup:

- [SQLite](sqlite.env.example)
- [MySQL/ Postgres](mysql.env.example)

### Installing

1.) Install dependencies:

```bash
$ yarn install
```

2.) Configure Environment Variables

Edit the `.env.*.example` file with your data.

## API Documentation

This application has a full API description available under: `/api/swagger`

## Deployment

```bash
$ yarn start:dev
```

## Built With

- [Nest.js](https://nestjs.com/)

## Authors

- **SvenC56** - [SvenC56](https://github.com/svenc56)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
