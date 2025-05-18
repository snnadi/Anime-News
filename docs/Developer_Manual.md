Developer Manual:

Here is guide to the future developer that wants to continue the AnimeNews Cental journey.

First you need:
A supabase account (To log users questions on the help page)
Node.js/npm
A vercel account to deploy the website

Clone the repository using git clone.
(Recommand picking the SSH link on the git repository for the AnimeNews Central repository.)

Create a .env, so it could hold your supabase url and key.

Now you need to log the page locally.
Start with in the terminal:
Npm install
npm install express rss-parser dotenv @supabase/supabase-js
npm run dev
npm start



GET '/api/featured'

This GET fetches from the AnimeNewsNetwork RSS feed the top 4 news in the anime that day. 
This is used for the “Today’s Top Anime News” section of the home page.

GET '/api/popular'

This GET fetches from the AnimeNewsNetwork RSS feed the top 5 news in the anime that day. 
This is used for the “Popular News” section of the home page.

GET '/api/news'

This pulls all the news from the AnimeNewsNetwork RSS feed. On each page has only 5 news sections. This is used for the “Latest Anime News” section of the news page.

GET '/api/reviews'

This GET fetches the url that has “review” in it and list it down from AnimeNewsNetwork RSS into pages. Each pages has 5 pages or less. 



GET '/api/seasonal'

This is where we make a request to the Jikan API to get the new anime during that season.(in this case spring animes). It takes the first 6 anime, which include the image, url, and title of the anime. This is used for the new page, in the “New This Season” section. 


POST '/api/questions'

First when a users on the help page and submit their question, email, and description, this sends a POST request to '/api/questions' where it sends this data into the supabase database. 
This is used in the help page.


GET '/api/questions'

This is a way to get all the questions the users have asked. It serves as another way to access the users questions. This is used in the help page. 

API references: 
https://www.animenewsnetwork.com/encyclopedia/api.php
https://jikan.moe/ 

RSS:
https://www.animenewsnetwork.com/all/rss.xml?ann-edition=us 

JS Libraries:
anime.js
react.js
Node.js 


Bugs:

In the “Today’s Top Anime News” The 4 anime links are suppose on have images for each one however, it does not load in.

On the help page, when you go into the dark mode, the Ask a Questions forum doesn’t blend well with the dark mode.

Similar with the help page, the About page, center where information about me and the website doesn’t blend well with the dark mode. 


For future development:

Next updates:

Adding in a sign-in feature to the website. There’s already a sign-in buttom, serving as a placeholder for it. With the sign-in feature, you could add another feature where the users doesn’t have to put in their email for the help page, but the website would take in the email they sign-in with.

Create a email/message system where when the users signs into the website, they could choice to get email on the latest anime news and have it be text to their phone.  

Comments sections for the home, news, and review pages.

An update for "Sidebar: Popular News Placeholder" in the new page. This will display images relates to the anime of topic for the anime news. It will gather the most viewed anime news of the week.

An update for "Sidebar: Top Reviewed Anime placeholder" in the review page. Here it will have the list of the top viewed review article in the anime community of that week. It will display a image relates to the anime of the review, and show the titile of it when you hover over it. 


Future updates:
A rating page: A page where it goes over the top rating for each years like in 2020, 2021, 2022, 2023, 2024, and 2025 in a form of a bar chart.

Add a warning message when a user is on the website for more than 2 hours. In the message it tells the users to take a break from their laptop, so they don’t damage their eyes. The message could include the dangers of looking into your laptop screen for too long. 
