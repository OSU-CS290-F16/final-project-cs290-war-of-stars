/*I'll put some functions in here for:
 * login
 * entering planets
 * leaving planets
 * closing game
 * */

var planet = document.getElementsByClassName('planet-click');
for(var i = 0; i < planet.length; i++){
   planet[i].addEventListener('click', handlePlanetClick);
}

var collectButton = document.getElementsByClassName('collect');
for(var i = 0; i < collectButton.length; i++){
   collectButton[i].addEventListener('click', handleCollectClick);
}

function handleCollectClick(event){
   var bounty = event.target.parentElement;

   // We'll post to the add-photo endpoint for the appropriate person.
   var postUrl = window.location.href + "/collect";

   // Start a new request to post our newly added photo as JSON data.
   var postRequest = new XMLHttpRequest();
   postRequest.open('POST', postUrl);
   postRequest.setRequestHeader('Content-Type', 'application/json');

   // Send our photo data off to the server.
   postRequest.send(JSON.stringify({
      person: bounty.id,
      credits: bounty.getAttribute("credits"),
   }));
   bounty.remove();
   console.log("Update sent to server.");
}

function handlePlanetClick(event){
   /*enter planet page*/
   var planetName = event.target.alt;
   location.replace("/" + planetName);
}
