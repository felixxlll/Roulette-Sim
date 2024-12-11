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
// All changes made to this map should instead be made to map_of_players_proxy
// This map is only managed by the proxy.
let map_of_players = new Map();

// Creates a proxy to check for changes in the map_of_players variable
// The main purpose for this is to update the website whenever you add or remove players.
const handler = {
    get(target, property) {
        if (typeof target[property] === 'function') {
            return (...args) => {
                const result = target[property](...args);

                // Trigger onMapChange for mutating methods
                if (['set', 'delete', 'clear'].includes(property)) {
                    CreatePlayers();
                }

                return result;
            };
        }

        return target[property]; // Return property for non-function keys
    }
};

let map_of_players_proxy = new Proxy(map_of_players, handler);

// Removes all players by clearing the map
$('#name-clear').click(function ClearNames(){
    map_of_players_proxy.clear();

    $('#players').empty() // Clears players from page
    $('#players').append("<p>Det finns inga spelare!</p>")

})

// This function should re-generate the players whenever a change is made
function CreatePlayers() {
    $('#players').empty() // Clears players from page

    map_of_players_proxy.forEach((value, key) => {
        $('#players').append("<div data-player='"+ key + "' class='player'><p class='player-name'>"+ key + "</p><p class='player-shots'>Skott skjutna: "+ value.shots + ".</p><button data-player='"+ key + "' class='shoot'>Skjut</button><button data-player='"+ key + "' class='reload'>Ladda om</button></div>")
    })
    console.log("Map updated") // DEBUG
}



// Adds player whenever form is submitted, or rather whenever the button is clicked
$('#name-submit').click(function CreatePlayer(){

    map_of_players_proxy.set($('#name').val(), {shots: 0, bulletPosition: 1 + Math.floor(Math.random() * 6)})
})







