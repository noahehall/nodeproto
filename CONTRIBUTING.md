# @nodeproto vision for ~~application~~ *product* development

before contributing, you:

- [must read this article](https://en.wikipedia.org/wiki/Collective_intelligence)
  - if we find you have not read that article, you will have to offer your soul in repentance
  - send souls to noahedwardhall+souls@gmail.com

- acclimate to our **Race** XP Methodology
  - [Core tool for management of internal issues](https://github.com/noahehall/nodeproto/projects/3)

## Race: XP Methodology

![@nodeproto Race:XP](/doc/racexp.png)

uses the `race [car|team] metaphor` as the ontology of rapid prototyping/product development

- ontology
  - a set of concepts and categories in a subject area or domain that shows their properties and the relations between them.
  - the philosophical study of being in general, or of what applies neutrally to everything that is real. It was called “first philosophy” by Aristotle in Book IV of his Metaphysics.

- ~one day I'll publish this~
- for now: the below should suffice

[THE FIELD](https://en.wikipedia.org/wiki/Glossary_of_motorsport_terms)

- The competing cars in an event.
  - `the pits` + `the grid`
  - all the tickets that could potentially be worked on

[THE PITS](https://en.wikipedia.org/wiki/Pit_stop)

- In motorsports, a pit stop is a pause for refueling, new tires, repairs, mechanical adjustments, a driver change, as a penalty, or any combination of the above. These stops occur in an area called the pits, most commonly accessed via a pit lane which runs parallel to the start/finish straightaway of the track
  - tickets that require business + engineering attention

[THE GRID](https://en.wikipedia.org/wiki/Glossary_of_motorsport_terms)

- The starting formation of a race, generally in rows of two for cars and three or four for bikes. The Indianapolis 500 traditionally has a unique grid of three cars per row.
  - tickets ready to be developed

THE RACE

- I like to use 4 in progress tracks (see `THE GROOVE` below)
- depending on the drivers part of your team, and each developers capabilities, will determine the set of in progress tickets and how they are categorized
  - e.g. a junior devs GROOVE is far different than a senior devs GROOVE
    - [you want to keep all of your engineers in their GROOVE](https://computus.org/7-tips-for-programming-in-the-zone/)

- The optimal path around the track for the lowest lap time. In drag racing it is about the center portion of the lane, where the cars can gain traction quicker.
  - `SLOW lane` too many of these and your drivers wont be happy, forecasts wont be accurate, and the *fast* lane will be over utilized to compensate for poor finishes
  - `THE GROOVE` [the optimal ticket](https://en.wikipedia.org/wiki/Glossary_of_motorsport_terms): your team is successful, drivers are winners, races are predictable
  - `FAST lane` too many of these means all your trophies are gold plated, but hey - you can fill your team with cheap engineers and junior devs
  - `THE LAST LAP` if our users arent using it then its not providing utility, and usually not useful to consider the ticket done, so use the the last lap for this usecase
    - there are a lot of stats and insights to glean from plotting tickets on these 4 dimensions over time...

[RACING FLAGS](https://en.wikipedia.org/wiki/Racing_flags)

- the dimensions on which a ticket is evaluated to ascertain quality:
  - basically anything you want, but all should be:
    - technical principals/best practices, e.g. DRY, SOLID, KISS, efficiency, effectiveness, etc.
    - not solvable by automation: keep your engineers biases to a minimum and the team focused on finishing the race successfully, not perfectly

- [MEATBALL](https://en.wikipedia.org/wiki/Racing_flags#Black_flag)
  - A mechanical black flag is a black flag with an orange disc in its center which indicates that a vehicle is being summoned to the pits due to serious mechanical problems or loose bodywork that presents a risk to other competitors. At some road racing events, it is used to summon the vehicle to the pits to inform the driver of violation "maximum sound levels.” Also known as the 'Meatball' flag.
  - only `meatballs` are rejected/reworked, everything else is pushed through (fk your opinions: the team has a race to win; if its not a *meatball*, it must be **steak**)

- [YELLOW FLAG](https://en.wikipedia.org/wiki/Racing_flags#Yellow_flag)
  - The solid yellow flag, or caution flag, universally requires drivers to slow down due to a hazard on the track, typically an accident, a stopped car, debris or light rain. However, the **procedures for displaying the yellow flag vary for different racing styles and sanctioning bodies**.
  - *too many* yellow flags and a ticket could be labeled a meatball
  - *too few* yellow flags is indicative of over optimizing (dont over optimize, be overly optimistic)
    - the idea being all tech is techdebt eventually, there is no perfectly groomed/scoped ticket. eventually all work will be redone
    - this idea should be built into your strategic planning and accepted as a first principle

- [CHEQUERED FLAG](https://en.wikipedia.org/wiki/Racing_flags#The_chequered_flag)
  - The chequered flag (or checkered flag) is displayed at the start/finish line to indicate that the race is officially finished. At some circuits, the first flag point will display a repeat chequered flag (usually on the opposite side of the circuit). The flag is commonly associated with the winner of a race, as they are the first driver to "take" (in other words, drive past) the chequered flag.
  - Upon seeing the chequered flag and crossing the finish line, drivers are required to slow to a safe speed, and return to their garage, parc fermé, or paddock, depending on the applicable regulations of the series.

- [ADR-TYPE](https://adr.github.io/)
  - for tracking architectural decision records of a particular type
    - types could be testing, ci, cd, recommended jamaican rums, etc
    - anything with an ADR tag should also have a `good first issue` as github automation surfaces `good first issue` to newcomers

TODO

- complexity of implementation (i.e. normal story points)
  - just because a ticket has a high story point, doesnt mean it takes a long time to complete
- complexiity of completion (a time dimension)
  - just because a ticket takes a long time to complete, doesnt mean its developmentally complex
- the RACE
  - each lane (slow, groove, fast, last lap) is the sum of implementation & completion complexity based on an individual/teams capabilities
- sprints
  - there is no sprint, or artificial deadline every X hours, we are in a race to buiild the best product, and each team goes in a circle: the grid > the race > the win: just like a formula 1 race team
    - the team should know when its time for retrospective, when its time to stop and plan, and when its time to race
- kanban
  - should be recurisve and rollup
    - each individual developer should have a board to track their race
    - each team should have a board (that rolls up individual races)
    - each prod org should have a kanban board (that rolls up team races)
    - each business unit... etc
- tools
  - maybe i'll build one...
