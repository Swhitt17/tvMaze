"use strict";
const MISSING_IMG_LINK = "https://tinyurl.com/tv-missing";

const $showsList = $("#showsList");
const $episodesList = $("#episodesList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
   const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`);
   
  return res.data.map(result => {
    const show = result.show;
    return{
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMG_LINK
    };
  });   
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

 async function searchForShowAndDisplay() {
    const term = $("#searchForm-term").val();
    const shows = await getShowsByTerm(term);

 $episodesArea.hide();
  populateShows(shows);
 }

 $searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
 });


 async function getEpisodesOfShow(id) {
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  
  return res.data.map(epi => ({
      id: epi.id,
      name: epi.name,
      season: epi.season,
      number: epi.number,
    }));
    
    
  }

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $episodesList.empty();


for(let episode of episodes){
  const $element = $(`<li> ${episode.name} (season ${episode.season}, episode ${episode.number}) <li>`);
  $episodesList.append($element);
 }
 $episodesArea.show();

}

async function getEpisodesAndDisplay(e){
  const showId = $(e.target).closest("[data-show-id]").data("show-id");
const episodes = await getEpisodesOfShow(showId);

populateEpisodes(episodes);
}
$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);


