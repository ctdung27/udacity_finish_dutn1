// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'dcwsy2r63e'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-l0dhhjl7.au.auth0.com',            // Auth0 domain
  clientId: '1eOybWvAa3bGdO4UaKE08Kq57AWpuahg',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
