<p align="center">
  <a href="https://www.chromatic.com/">
    <img alt="Chromatic" src="https://avatars2.githubusercontent.com/u/24584319?s=200&v=4" width="60" />
  </a>
</p>

<h1 align="center">
  Chromatic's GitHub webhook proxy service
</h1>

This repository provides a starter example webhook implementation to handle build status updates from Chromatic.

## Quick start

1.  **Create the proxy webhook service.**

    Use [degit](https://github.com/Rich-Harris/degit) to get this repository.

    ```shell
    # Clones the repository
    npx degit chromaui/github-webhook-proxy#main github-webhook-proxy
    ```

1.  **Install the dependencies.**

    Navigate into your new proxy service directory and install the necessary dependencies.

    ```shell
    # Navigate to the directory
    cd github-webhook-proxy/

    # Install the dependencies
    yarn
    ```

1.  **Open the source code and start editing!**

    Open the `github-webhook-proxy` directory in your code editor of choice to get acquainted with the webhook!

1.  **Test the webhook**

    Run `yarn start` to start the webhook proxy service.

## What's inside

A quick look at the top-level files and directories included with this repository.

    .
    ├── .gitignore
    ├── index.js
    ├── package.json
    ├── yarn.lock
    └── README.md

1.  **`.gitignore`**: This file tells git which files it should not track or maintain during the development process of your project.

2.  **`index.js`**: This file contains the proxy service implementation.

3.  **`package.json`**: The standard manifest file for Node.js projects typically includes project-specific metadata.

4.  **`yarn.lock`**: This is an automatically generated file based on the exact versions of your npm dependencies installed for your project.

5.  **`README.md`**: A text file containing helpful reference information about the repository.

## Environment configuration

To access GitHub's API via webhook, you'll need to configure the following environment variables based on the deployment solution you choose.

| Variable | Description                                                       |
| -------- | ----------------------------------------------------------------- |
| REST_API | GitHub API path.<br />`REST_API=https://api.github.com/` <br/> |
| TOKEN    | GitHub API token.<br/> `TOKEN=RandomAPIToken`                     |
| PORT     | Port to run the webhook.<br/> `PORT=4000`                         |

## Deployment

Deploy the webhook to the provider that best suits your organization's requirements. Possible deployment solutions include [Heroku](https://devcenter.heroku.com/articles/deploying-nodejs).

## Connect to Chromatic

Click the "Add webhook" button on your project's manage screen and provide the deployed URL for the webhook. Here's an example of what that might look like (assuming you've deployed to Heroku):

```
https://arcane-lowlands-8408.herokuapp.com/webhook?repoId=<repoId>
```

The example webhook handler requires the `repoId` query parameter to send a commit status update to your GitHub repository. You can find your repository ID by visiting your GitHub repository webpage and running the following in your browser console: 

```
$("meta[name=octolytics-dimension-repository_id]").getAttribute('content')
```

It should yield a (large) number.

### Additional resources

1. Learn how to [setup a webhook](https://www.chromatic.com/docs/integrations#custom-webhooks) in Chromatic.
2. See the official GitHub documentation on [webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks).
3. See the official Rest API documentation at [GitHub](https://docs.github.com/en/rest).
