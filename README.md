# chess-tournament-swiss
A service to manage a chess tournament using the Swiss pairing method

# Heroku
## 
TBD

## Build status
TBD

# Introduction
This started as an attempt to write a swiss pairing algorithm for chess tournaments, just for curiosity's sake. 

I'll start with a simple technology stack, `Node.js / Express / Typescript` stack, which I'm familiar with; I'll delay integrating a UI and will rely on `cURL` for as long as I can.

Possible technological improvements:
1. Add a MongoDB data storage; I could use a RDBS, but my teams use Mongo, and I need to learn it;
1. Add a `React` UI; right now leaning towards `Next.js`;
1. Integrate `Redux` with the UI;
1. Expand the service handle a plurality of use cases;

# Swiss Pairing
Swiss Pairing is a method of pairing players in a tournament, requiring a relatively small number of rounds, involving all tournament players, to determine the winner(s); it was used for the first time in Switzerland in 1895, and today tournament organizers use it primarily for chess tournaments. The Swiss Paring method addresses significant problems of round robin and single elimination tournaments:
* _Round robin_ tournaments require as many rounds as the number of players minus 1. Since most 2-hours / game tournaments take place over a weekend, limiting the number of rounds to 6, and the field to six players. Swiss pairing limits the number of rounds to log base 2 of the number of players, enabling up to 32 players to context a 2-hours/game weekend chess tournament.
* _Single elimination_ tournaments leave half the field with nothing to do after the first round. Each successive round eliminates half the field, leaving these players with nothing to do. Swiss pairing is one way to provide pairings for all players in all rounds.

## Swiss Pairing Rules
The [FIDE](https://handbook.fide.com/chapter/C0401#:~:text=The%20following%20rules%20are%20valid%20for%20each%20Swiss,received%20a%20...%20%207%20more%20rows) basic rules are:
1. The number of rounds to be played is declared beforehand.
1. Two players shall not play against each other more than once.
1. Should the number of players to be paired be odd, one player is unpaired. This player receives a pairing-allocated bye: no opponent, no colour and as many points as are rewarded for a win, unless the rules of the tournament state otherwise.
1. A player who has already received a pairing-allocated bye, or has already scored a (forfeit) win due to an opponent not appearing in time, shall not receive the pairing-allocated bye.
1. In general, players are paired to others with the same score.
1. For each player the difference between the number of black and the number of white games shall not be greater than 2 or less than –2.
1. Each system may have exceptions to this rule in the last round of a tournament.
1. No player shall receive the same colour three times in a row.
1. Each system may have exceptions to this rule in the last round of a tournament.
1. Colour balancing
    1. In general, a player is given the colour with which he played less games.
    1. If colours are already balanced, then, in general, the player is given the colour that alternates from the last one with which he played.
1. The pairing rules must be such transparent that the person who is in charge for the pairing can explain them.

The Sensei Library provides additional suggestions regarding how to increase the chance of 

The Swiss Pairing method is a good choice to decide who ends up at the top spot; it is not always clear who should get the 2nd and third place prize; The [Sensei Library](https://senseis.xmp.net/?SwissPairing#:~:text=Swiss%20Pairing%20is%20a%20TournamentFormat,%20i.e.%20a%20method,go%20tournaments,%20notably%20the%20World%20Amateur%20Go%20Championship) provides additional suggestions, which are out of the scope of this experiment. 

# Elements
Following are definitions specific to this system:
* **Account Holder** - An individual who created an account;
  * the `system administrator` is a default `account holder` with the privilege to perform all supported operations;
* **Game** - An event where two `account holders` play  a chess game;
* **Tournament** - An event consisting one or more `games` between two or more `account holders`;
  * tournaments have one or more `rounds`; 
  * a `round` has one or more `games`;  
  * there are many `tournament types`:
    * *_swiss pairing_*
    * *_round-robin_* -
    * *_match_*
    * *_single-elimination_*
    * double-elimination_*
* **Player** - An `account holder` playing in a tournament; used to collect a contestant's data relative to the tournament;
4