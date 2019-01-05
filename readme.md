# Creating a century ride training api

Useful link for api: https://developers.strava.com/playground/

## Authentication process

- Using Stravas OAuth2 implementation

Process is:

1. Redirect user to oAuth URL to sign into Strava and give api access to their account
   Example Request:

[https://www.strava.com/oauth/authorize?client_id=clientid&response_type=code&redirect_uri=redirecturi&scope=activity:read_all&approval_prompt=auto](https://www.strava.com/oauth/authorize?client_id=clientid&response_type=code&redirect_uri=redirecturi&scope=activity:read_all&approval_prompt=auto)

2. Strava app then redirects back to URL the client provides with an auth code in the query string
   Example URL:

[localhost:3000/?code=kafdk234234ksdfk234k234](localhost:3000/?code=kafdk234234ksdfk234k234)

3. The server then requests a token from Strava by sending a POST call to Stravas OAuth token server

[https://www.strava.com/oauth/token?client_id=clientid&client_secret=clientsecret&code=codefromstrava&grant_type=authorization_code](https://www.strava.com/oauth/token?client_id=clientid&client_secret=clientsecret&code=codefromstrava&grant_type=authorization_code)

4. If the auth code and other parameters are good, Strava will give you an auth token
5. You can then call the API as long as you have the right access. Add the access_token as a header like so:

```
Authorization: Bearer <insert access token here>
```

## Ideas behind the app:

- Provide a dashboard that tracks progress towards training for a Century ride
- Most metrics would be based upon some kind of training regimen I agree to take on in order to prepare for the goal

## Key Metrics:

- Likelihood of completing the race
- Total elevation gained
- Total miles ridden this week & month
- Total miles targeted to ride this week & month
- Longest ride

## Architecture:

### Front End:

- Client Redirect to strava api for authentication
- present data to the user in a meaningful way
- use Tiles or some other easy to configure dashboard

### Back end:

- Endpoints/Routes:
  - provide several api endpoints which pull the data needed to create dashboards
- Have Unit tests validate JSON format received matches a locally saved json format

## How to Run

1. clone the repository to your local machine
2. install dependencies

```
npm install
```

3. create a .env file and put the following items inside
4. npm start
