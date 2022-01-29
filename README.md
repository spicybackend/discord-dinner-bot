# Dinner Time Discord Bot
A handy bot to track a menu of user-entered meals and post a random selection of them into a Discord channel on a weekly schedule.

## Installation
### Dependencies
This bot is run with Node. You can use `nodenv` to install the pinned version in `.node-version` if you don't have it installed already.

```sh
nodenv install
```

A few node dependencies are added, mostly for development, and a few of them need cleaning up... but without looking to closely you can install them with yarn.

```sh
yarn install
```

### Configuration
An example configuration file is provided as a template. You can copy this over with the command below, and then replace the variables with your own Discord bot and instance details.

```sh
cp config.ts.example config.ts
```

## Usage
### Slash commands
First you'll need to deploy some definitons to Discord to set up the slash commands for users to add and list meals.

```sh
yarn deploy:commands
```

Then just run the bot and if everything is configured correctly, it'll start happily storing meals.

```sh
yarn bot
```

### Meal planner
Feature coming soon.

```
yarn bot:schedule
```
