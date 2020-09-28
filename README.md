# The Art of Magic The Gathering

## Authors:

Keith Musig, Michael Eclavea, Taylor Johnson, Czarl Jalos

## Overview:

Homepage with a random card. Showcasing the artist.
Search for a card by name, type or artist.
When query results render have them show a button “see more form this artist”
Artist button will generate a new query and render all cards made by them to the page.
Allow user to save cards or artist to a favorites list.
Delete cards for artists from favorites.
Problem solved:
There are over 400 unique artists who have made works for the game.
Ever wonder who made that card you love so much or found so striking? This tool will let the user find cards based on search criteria they are interested in (name, type, sub-type). Then the user can explore all the art that Artist has made by clicking a button.
MVP: able to search for cards and save them. Able to view saved cards. Able to remove cards from saved list.
STRETCH
Change the way it looks with css toggle:
Integrate with google API to search for the artists store page and direct the user to them.

## User Stories

1. Title: Card Search
2. User Story sentence: As user I want to search for cards by name so that find all the info and image of the card.
3. Feature Tasks: Add search function to find cards by name from API.
4. Acceptance Tests: User can search for card by name. Site will render cards with key word in name, on a new page.

5. Title: Artist Search
6. User Story sentence: As a user I want to search for cards by artist so I can find many works from a single artist.
7. Feature Tasks: Add search function to find cards by artist name from API.
8. Acceptance Tests: User can search by artist name. Site will render cards from that artist on a new page.

9. Title: Save to favorites
10. User Story sentence: As a user I want to save favorite artists/cards so I can find them easily.
11. Feature Tasks: Add save functionality that will store card object in the database
12. Acceptance Tests: User can click to save a card and the database will be updates. Saved cards render on a favorites page.

13. Title: Delete favorites
14. User Story sentence: As a user I want to delete saved artists/cards that I am no longer interested in to make my favorites cleaner.
15. Feature Tasks: Add delete functionality that will remove a card object from the database.
16. Acceptance Tests: User can click delete button on a card in Favorite and remove that card from the database. Deleted card will no longer render in favorites.

17. Title: Artist showcase
18. User Story sentence: As an artist I want players to be able to find all the cards I have painted on a single page.
19. Feature Tasks: Create ‘see more from this artist’ button that renders with each card object with art by the same artist.
20. Acceptance Tests: User can click a button that shows all cards created by the artist of the card they are viewing.
