/*I'll put some functions in here for:
 * login
 * entering planets
 * leaving planets
 * closing game
 * */

var loginButton = document.getElementsByClassName('login-button');
for(var i = 0; i < loginButton.length; i++){
   loginButton[i].addEventListener('click', handleLoginClick);
}

var planet = document.getElementsByClassName('planet-click');
for(var i = 0; i < planet.length; i++){
   planet[i].addEventListener('click', handlePlanetClick);
}

var homeButton = document.getElementsByClassName('home');
for(var i = 0; i < homeButton.length; i++){
   homeButton[i].addEventListener('click', handleHomeClick);
}

var logoutButton = document.getElementsByClassName('logout');
for(var i = 0; i < logoutButton.length; i++){
   logoutButton[i].addEventListener('click', handleLogoutClick);
}

function handleLoginClick(event){
   // this should be handled now by the 'required' field
   // i've added server side logic to make sure it doesn't submit empty
   // var username = document.getElementsByTagName("input")[0].value;
   // console.log(username);
   // if(username != "") {
      // location.replace("/index");
   //}
}

var collectButton = document.getElementsByClassName('collect');
for(var i = 0; i < collectButton.length; i++){
   collectButton[i].addEventListener('click', handleCollectClick);
}

function handleCollectClick(event){
   var bounty = event.target.parentElement;
   console.log(bounty);

   // We'll post to the add-photo endpoint for the appropriate person.
   var postUrl = document.url + "/collect";
   console.log(postUrl);

   // Start a new request to post our newly added photo as JSON data.
   var postRequest = new XMLHttpRequest();
   postRequest.open('POST', postUrl);
   postRequest.setRequestHeader('Content-Type', 'application/json');


   postRequest.addEventListener('load', function (event) {
      var error;
      if (event.target.status !== 200) {
        error = event.target.response;
      }
      callback(error);
   });

   // Send our photo data off to the server.
   postRequest.send(JSON.stringify({
      person: "han Solo",
      credits: 10
   }));
   bounty.remove();
}

function handleHomeClick(event){
   /*add credits to user for collected bounties*/
}

function handlePlanetClick(event){
   /*enter planet page*/
   var planetName = event.target.alt;
   location.replace("/" + planetName);
}

function handleLogoutClick(event){
   /*block home button in nav bar*/
   /*store user data and user*/
}
