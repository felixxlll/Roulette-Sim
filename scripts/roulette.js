// Prevents form submission from reloading the page
$('form').submit(function (e) {
    e.preventDefault();
});

// Reloads a players gun
function Reload(player) {
    
};

// Reloads all guns
function ReloadAll() {

}

// 
function Shoot(player) {
    // if player.shots == 0, you're dead
};

// IMPORTANT!
// All changes made to this list should instead be made to list_of_players_proxy
// This list is only managed by the proxy. Maybe this should've been other way around...(?)
let list_of_players = []

// Creates a proxy to check for changes in the list_of_players variable
// The main purpose for this is to update the website whenever you add or remove players.
let list_of_players_proxy = new Proxy(list_of_players, {
    set: function (target, property, value) {
        CreatePlayers(); // Triggers whenever the list changes
        target[property] = value; // Perform the default array operation
        return true; // Indicate success
    }
});

// This function should re-generate the players whenever a change is made
function CreatePlayers() {
    console.log("List updated")
}

// Adds player whenever form is submitted, or rather whenever the button is clicked
$('#name-submit').click(function CreatePlayer(){
    let player = {
        name: $('#name').val(),
        shots: 1 + Math.floor(Math.random() * 6)
    }
    list_of_players_proxy.push(player)
})

// Removes all players by clearing the list
$('#name-clear').click(function ClearNames(){
    list_of_players_proxy.length = 0;
})





