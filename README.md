## Description

Minimal Twitter-like api using GraphQL, TypeScript, PostgreSQL and NestJS

## Installation

```bash
$ npm install

OR 

$ yarn install
```

## Dependencies

1. You will need a postgres database running, you can spin one up pretty easily using the docker-compose command if you like, otherwise you'd need to set one up manually.
2. You will need to create a .env file and supply the JWT_SECRET environment variable in there so that JWTs can be signed.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API

The API offers only very basic functionality detailed below.

### Login Mutation:

For this mutation the assumption is made that the password has been hashed on the client side before transmitting up to the back-end.
If the login is successful the response will contain a JWT which will be used for authentication moving forward.

```gql
mutation {
  login(userName: <username here>, hashedPassword: <hashed password here>)
}
```

### Register Mutation:

A simple mutation that just creates a new user and saves it to the database.

```gql
mutation {
  register(firstName:"shahab", lastName:"dogar", email:"shahab96@gmail.com", userName:"shahab96", hashedPassword:"test") {
    id
  }
}
```

### Post Mutation

Posts a new message for the current user, derived from the JWT.

```gql
mutation {
  post(content:"Hello World!") {
    id
  }
}
```

### Edit Post Mutation

Edits an existing post

```gql
mutation {
  editPost(id: "76de3833-aad4-49c9-9afd-4a8d533e51ab", content: "Edited Post") {
    id
  }
}
```

### Delete Post Mutation

Deletes an existing post

```gql
mutation {
  deletePost(id:"76de3833-aad4-49c9-9afd-4a8d533e51ab")
}
```

### The Me Query

This will run a query to provide data on the currently logged in user (derived from the JWT)

```gql
query {
  me {
    firstName
    lastName
    id
    posts {
      id
      content
    }
  }
}
```

### Follow Mutation

This will have the currently logged in user (derived from JWT) follow a specified user

```gql
mutation {
  follow(user: "cb2b7edc-fb79-4369-bb26-115f3367f76c") {
    id
  }
}
```

### Unfollow Mutation

The opposite of the follow mutation, unfollows a user that you are following

```gql
mutation{
  unfollow(user:"89d9dc00-53c7-4331-b723-73e68811b7dd")
}
```

### Subscriptions

You can subscribe to posts from a specific user with the following gql query

```gql
subscription {
  postAdded(user: <user id of the person you want to subscribe to>) {
    content
  }
}
```

If you want to be notified when someone follows you, there's a subscription for that.

```gql
subscription {
  notifyOfFollower{
    userName
  }
}
```

## Implementation

For this project I decided to use the NestJS framework, since basically 90% of everything that needed to be done is provided out of the box. This allowed me to focus more on the actual logic rather than setting up routes, resolvers, authz, etc.

### Pros
* Very easy to understand project structure
* Highly extensible
* Easy to maintain due to each component being in it's own file
* Offers an absolute TON of features baked into the framework

### Cons
* The framework is pretty heavy, so if you were to run this on serverless infrastructure like AWS Lambda, you'd likely see some pretty painful coldstarts
* Can be slightly overwhelming for newcomers to the framework

