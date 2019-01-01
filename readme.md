# Creating a century ride training api

Useful link for api: https://developers.strava.com/playground/

link to let user authorize: https://www.strava.com/oauth/authorize?client_id=31073&response_type=code&redirect_uri=http://localhost&approval_prompt=force

## Authentication process

- Using Stravas OAuth2 implementation

Process is:

1. Redirect user to oauth URL to sign into Strava and give api access to their account
2. Strava app redirects back to URL the client provides with an auth code
3. The server sends a POST call to Strava for an access token using the auth code from above
4. If the auth code and other parameters are good, Strava will give you an auth token and refresh URL
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

## User flow:

1. go to the website
2. authenticate user if first time
3. async render minimal functioning screen
4. begin calling api to get the key metrics
5. paint each metric as a card on the screen

## Things to resolve

- figure out how to structure server properly

## How to Run

1. clone the repository to your local machine
2. install dependencies

```
npm install
```

3. create a .env file and put the following items inside
4. npm start
