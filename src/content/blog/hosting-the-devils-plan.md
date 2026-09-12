---
title: Hosting The Devil's Plan
slug: hosting-the-devils-plan
excerpt: I ran two simultaneous seasons of Netflix's The Devil's Plan with a nine-person production team. Here's the design work behind it, and what hosting it taught me.
tag: Game Design
date: 2025-05-01
author: Devon Sampson
---

<figure class="blog-figure">
  <img src="/blog/devils-plan-title.webp" alt="Key art for Netflix's The Devil's Plan" loading="lazy" decoding="async" width="705" height="397" />
</figure>

It's kind of awkward when one of the most interesting projects you've ever worked on is also borderline-impossible to explain to someone outside of a niche community. Regardless, in this post I'll try to do the impossible because I was really proud of how this project turned out and the experience of hosting it taught me several lessons about game design.

In late-2023, the first season of Netflix's *The Devil's Plan* (henceforth, *TDP*) aired and it immediately became one of my all-time favorite shows and reality competition formats. *TDP* is a South Korean reality show in which contestants attempt to gain (or at least not lose) "Pieces", the in-game currency, by competing in a series of strategic games. If a player loses all of their Pieces, they are eliminated from the show. As you might expect, the last remaining player is declared the winner.

<div class="blog-embed">
  <iframe
    src="https://www.youtube-nocookie.com/embed/8iJhXyCazXo"
    title="The Devil's Plan — trailer"
    loading="lazy"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

I had the itch to host another ambitious, multi-month game and I knew enough people who also enjoyed the show that I decided to host my own version of *TDP*. Similar to how I organized my version of *The Mole*, I built the cast around a handful of recruits that I knew would provide entertainment value, then posted open applications. The response was overwhelming for a game based on a niche Korean reality show — so much so that I decided to build two casts and host two seasons simultaneously.

To be clear, this was insane of me. I felt an immediate sense of dread as if I had seen a vision of all the work that hosting two seasons simultaneously was going to involve, so I aggressively recruited people to help me out in production. The production team ended up consisting of nine (!!!) people when it was all said and done.

## Visuals, Aesthetics, and Vibes

I didn't focus on the visual presentation much when designing *The Mole*, but it would need to be more of a priority here since so much of what made *TDP* work was its ambiance — the stern-looking game environments which underscored the seriousness and high stakes of the games, as well as evocative, cryptic iconography that hinted at secrets beneath the surface (in the Netflix show, there were escape room-like puzzles for players to discover and solve between games that offered opportunities to earn bonus Pieces).

First, we made cool player and production avatars. And by "we", I mean Lee, one of the production members (as well as the Mole in my aforementioned *Mole* game the previous year).

<figure class="blog-figure blog-gallery">
  <div class="blog-gallery-grid">
    <img src="/blog/devon-photo.webp" alt="Devon Sampson" loading="lazy" decoding="async" width="768" height="768" />
    <img src="/blog/devon-avatar.webp" alt="Devon's production avatar for the game" loading="lazy" decoding="async" width="768" height="768" />
  </div>
  <figcaption>Me in real life and my production avatar for the game.</figcaption>
</figure>

*(Below: the official graphic for all the players in both casts — red/orange was called The Devil's Plan: Alpha Game and blue was The Devil's Plan: Omega Game. The closest we had to a celebrity was the player in the lower-right, Danny Butler, who participated on CBS's The Amazing Race in 2024.)*

<figure class="blog-figure">
  <img src="/blog/devils-plan-cast.webp" alt="Official cast graphic for both the Alpha Game and Omega Game seasons" loading="lazy" decoding="async" width="2048" height="1906" />
</figure>

I wanted to contribute to the aesthetic as well, so I made an introductory montage for the season that served as part-opening credits, part-sizzle trailer. My aim was to set an intense, competitive mood from the start so I used the Pendulum song "Nothing for Free" and spliced in clips from its music video. Even today, years later, it makes me want to run through a brick wall.

<div class="blog-embed">
  <iframe
    src="https://player.vimeo.com/video/890087174"
    title="Opening montage for The Devil's Plan"
    loading="lazy"
    frameborder="0"
    allow="autoplay; fullscreen; picture-in-picture"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

I had put myself into a situation where I had twenty-four players counting on me to make the best game possible, a nine-person production team I was responsible for leading, and a multi-month-long game ahead of me to design and host. At this point I realized it would be a waste if I didn't completely empty the tank to make this the most legendary, memorable game I could possibly design.

## General Game Design

I realize it may come as a disappointment given the elaborate preamble above that at least half of the game design was fairly easy. Most of the players had already seen the Netflix show, so I knew there was be an expectation that the most interesting and popular games from the show would appear in my version of it. Fortunately, there were multiple Reddit [posts](https://www.reddit.com/r/TheGenius/comments/17wwwps/for_everyone_that_watched_the_devils_plan_and/) in which people posted graphics from the games, allowing me to seamlessly host them online using Discord and Google Slides.

The only notable change I made to these games was altering their payout structures. On the Netflix show, after a game's rules are explained it is then revealed how many Pieces will be won or lost depending on placement — for example: 1st Place = 3 Pieces, 2nd/3rd = 1 Piece, Second-Last = lose 1 Piece, Last Place = lose 3 Pieces. The Netflix season had an issue where there weren't quite enough eliminations before the last few episodes, so I altered the payout structures to ensure that there would usually be one or two players that would run out of Pieces, and thus be eliminated, regardless of a game's outcome.

Although it's generally not a good practice when hosting a game like this to change rules as the season is progressing, I decided that in this context it was necessary to set the payout structures the night before hosting a particular game, based on the players' current Piece counts. This was obviously not to rig the game in favor of or against certain players, but simply to make sure that there would be an appropriate amount of eliminations each round.

## Unique Games

### Extended Breakdown of "Deal With It"

For Round 2, I decided the Main Match (the main game of the round that determines who gains and loses Pieces) would be a modified version of a game that one of my production team members designed for a similar project a few years prior. For context, I've posted the rules below in the same form that I presented them to the players — although I also gave them a verbal explanation of the rules with a Q&A period on the night of the game.

OBJECTIVE:

- Have the most money at the end of 8 rounds.

SETUP:

- Each round will start with the players divided into 3 rooms of 4 people.
- At the start of each round, it will be announced how much money that round is worth.
- One person in each room will be the **Boss,** and will make an offer that splits the money for that round between themselves and two other people in that room (the "regular players").
- The person left out will get a **Promotion:** they will not receive any money that round, but the following round they will move to the next room and become the Boss of that room.

WHAT HAPPENS EACH ROUND:

- Each round, you will have 5 minutes to discuss and negotiate with (only) the players in your room.
- Once the time is up, the Boss will submit a proposal to their Prod Chat outlining who will receive the promotion, how much money they will set aside for themselves, and how much money each regular player will receive.
- They will also have to choose which regular player will have their share **revealed.**
- The room moderator (production) will then reveal who is getting the Promotion, the player whose amount was revealed, and how much money they were allocated in the deal (the Boss's share and the other regular player's share will be **hidden.**)
- Then the two regular players will vote.

VOTES:

- The two regular players will be prompted to extend their thumbs up (if they approve the deal) or down (if they reject the deal) at the same time.
- If both players give a thumbs up, the deal is approved and the money offered by the Boss will be deposited into their accounts.
- If even one of the two players gives a thumbs down, the Boss will get 1/4 of the money for that round and each of the regular players will get 1/8 of the money. The remaining 1/2 of the money for that round will disappear.

TWISTS:

- After round 4 but before Round 5 (halfway through the overall game), you'll get a 20-minute intermission to move around the call channels freely and discuss the game.
- The total amount each player has earned so far **will be revealed** right before this intermission.
- The players that receive Promotions in the final round will receive the same amount that the Bosses of their respective rooms end up receiving that round.

#### Modifying "Deal With It"

The above is the final version of the game, but in the original version, the Boss of a room received half of the available money if a deal was rejected. I thought this was too generous for Bosses and it seemed like a dominant strategy for them to propose selfish deals, since their worst-case scenario was still appealing.

It was more optimal that failed deals would result in the Boss getting 1/4 of the available money and the two non-promotees getting 1/8 each. Faced with the prospect of a meager return in a key round, Bosses would be more incentivized to offer (or at least, pretend to offer) more egalitarian deals. There remained pressure for all parties to facilitate accepted deals, as failed deals would still result in half the money getting destroyed, a setback in the overall standings for all involved relative to those that were able to reach an agreement for the full pot.

Perhaps most importantly, I removed the rule in the original version that allowed Bosses to reveal the amount they allocated to themselves in their proposed deals. The most interesting mechanic in the entire game is that you don't know whether the Boss of your room proposed a deal that's lopsided in their own favor. If Bosses had the freedom to reveal their own amount before the deal was voted on, I felt like it would lead to a dominant strategy where non-Bosses should always demand that their Bosses reveal their own amount.

From a game design standpoint, this was one of the big success stories of the project, as these rule changes led to a game night I found to be wildly entertaining.

### "Night of the Ninja"

*Night of the Ninja* is a short (at least, when played in-person) social deduction game widely available at board game stores. Here's the shortest video I could find that explains how the base game works:

<div class="blog-embed">
  <iframe
    src="https://www.youtube-nocookie.com/embed/TTlyxRl7tGU"
    title="How to play Night of the Ninja"
    loading="lazy"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

My one modification to this game was that at a specific moment in each round (right before Blind Assassins are played), players would get a five-minute intermission to mingle around the various call channels in the Discord server to discuss strategies.

This rule change, in itself, worked great. It led to the scrambling and backroom dealing that makes the format of *TDP* more interesting than your average tabletop game.

But there was one major issue: the game took **forever.** *Night of the Ninja* has several phases of cards being dealt to players and then players passing some cards to neighbouring players. Without a physical space to deal cards privately to players, and with drag-and-drop of image files being insufficient, I resolved to use random.org to "shuffle" the deck, then let each player know what their "hand" was in their own private chats with me. This was, as you could imagine, outrageously inefficient. The result was that a night I promised would only take around 1 hour and 45 minutes ending up taking longer than 3 hours. Years later, many production members claim to have lingering PTSD from the constant admin we all had to do that night in order to make the game work.

I'm being somewhat dramatic, because although it was a stressful evening for myself and the production team, I received a surprising amount of positive feedback from the players. One of them even bought the physical game the next day!

It was so clear to me that *Night of the Ninja* was going to be a perfect game for this format, and although I wasn't necessarily wrong, this made me blind to the practical constraints I was facing. Everything about this *Devil's Plan* project had been going so well despite the challenges of hosting two seasons at once that I felt infallible, but on this night, my eyes were bigger than my stomach.

## Miscellaneous Decisions and Lessons from Hosting *The Devil's Plan*

This post has already been longer than I intended so I'm going to wrap this up with some miscellaneous thoughts and lessons-learned from the whole experience:

- I wanted to create a game that didn't conflict with people's regular lives, so Main Matches were held on specific times each week. However, I wanted to give players room to strategize and stay engaged throughout the week, so I allowed communication between players on off-days (whereas I didn't allow this during my *Mole* game).

- Prize Matches — games in which the group worked together to add money to the Finale winner's prize — were the least interesting part of the show but I didn't have a better alternative so I ran them mostly as activities players could do on their own time between game nights. My main addition here was that I had more Pieces on the line in these games than the Netflix show did, and designed them as dilemmas between helping the group win the Prize Match and helping yourself win Pieces.

- The Netflix show had a "semi-final" game that ensured that only two players would survive and advance to the Finale. I decided that it would be more dramatic to have a "quarter-final" game that ensured only three players survived, followed by a semi-final in which the last place finisher fell short of the Finale.

- The Netflix semi-final game was a poker variant, but it was an original game overall that used complex equations. Even though I didn't like the specific game, some form of poker felt appropriate in the endgame so I chose Omaha Hi-Lo, played on [Poker Now](https://www.pokernow.club/), with each player's Piece count being converted into chips for the game. I chose Omaha Hi-Lo because there's fewer educational resources about it on the internet compared to Texas Hold 'Em, so players that had busy lives wouldn't be disadvantaged compared to those who had more free time to prepare.

- The Finale was a best-of-three in which the games were [Fugitive](https://boardgamegeek.com/boardgame/370597/fugitive-second-edition), Matching Memory Maze (a game I invented and playtested), and Betting Black and White (from a similar Korean show titled *The Genius*).

- On the Netflix show, one of the Finale games — *Nine Men's Morris* — was telegraphed to the players by including copies of the games in their living quarters. I did the same for *Fugitive*; I felt that it wouldn't disadvantage players with less free time to devote to the game outside of game nights because the game is more about reading your opponent than discovering dominant strategies.

## Final Thoughts

In all the years that I've been hosting these kinds of games, this one was definitely the most enjoyable and well-received. So many people put so much work into producing it that a tone was set for the players that the game was serious and important. These adjectives aren't usually associated with fun game nights, but the culture that we cultivated around the game truly led to some peak experiences for players when they pulled out dramatic victories, or narrowly avoided death, in a meta-game they were desperate to win.
