# Lambda Cloud Node.js API

This is a unofficial Node.js client for the [Lambda Cloud API](https://cloud.lambdalabs.com/api/v1/docs)


## Installation

npm:
`npm add lambda-cloud-node-api`

pnpm:
`pnpm add lambda-cloud-node-api`

yarn:
`yarn add lambda-cloud-node-api`


## Usage

The usage is quite simple and the interfaces are exactly the same as provided by Lambda.

```typescript
// Create new API instance with your apiKey and optional API base path
const client = new LambdaCloudAPI({ apiKey: 'YOUR_API_KEY' })

// Returns a map of running instances { id1: Details, id2: Details }
const runningInstances = await client.listRunningInstances()

// terminate everything
const terminatedInstanceIds = await client.terminateInstances(Object.keys(runningInstances))
```

### Error Handling

For 2xx HTTP Status codes the promise resolves as usual. For all other status codes the promise will reject with a `ErrorResponse` which contains the status code and the error message from the API. If fetch fails due to a network error, the promise will reject with a fetch error.

```typescript
const client = new LambdaCloudAPI({ apiKey: 'YOUR_API_KEY' })
// this will reject, the reason will be a ErrorResponse object
const instance = await client.getRunningInstance('non-existing-id')

const invalidClient = new LambdaCloudAPI({ apiKey: 'YOUR_API_KEY', basePath: 'invalid-base-path.com' })

// this will reject, the reason will be a fetch error
const instance = await client.getRunningInstance('non-existing-id')

```

## Functionality

All functions that are shown in their [Docs](https://cloud.lambdalabs.com/api/v1/docs) is currently supported. This includes:

- List available instance types
- List running instances
- Get detail of running instance
- Launch new instance
- Terminate instances
- Restart instance
- List available SSH keys
- Delete SSH keys
- Add new SSH key
- Listing available filesystems

## Compatibility

This library uses the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This requires at least **Node 18**. This is otherwise a plain Javascript library and should be able to run pretty much anywhere, just don't run it on the client-side if you don't want to expose your API keys.

