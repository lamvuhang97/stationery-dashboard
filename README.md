# gxm-video-dashboard

## Deploying to production

The following environment variables should be set:

- `API_TOKEN` - The JWT token to use for the api (Is this necessary?)

- `API_ADDRESS` - The address to use for the api. EX: 'https://gxm-video-platform.herokuapp.com'

- `SERVER_URL` - the address where the dashboard is deployed, ex 'https://gxm-video-dashboard.herokuapp.com'

- `HOST`=0.0.0.0 - IP addresses to listen on

- `NPM_CONFIG_PRODUCTION`=false 

- `NODE_ENV`=production


## Development:

### Optional - Used for testing:

- `LOG_FILE` - The file to save/read stored api responses from for testing

- `SERVE_LOGGED_RESPONSES` - when set will serve from the json file located at `LOG_FILE` rather than hitting the api

- `LOG_RESPONSES` - when set will save requests from the server to the log file 

Environment variables may be set in the environment or in a .env file located in the root of the project directory.

*Autogenerated:*
### Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
Set the API_TOKEN environment variable to the correct JWT token
$ npm run dev

# build for production and launch server
Set the API_TOKEN environment variable to the correct JWT token

$ npm run build
$ npm run start

# generate static project
Set the API_TOKEN environment variable to the correct JWT token

$ npm run generate
```


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).