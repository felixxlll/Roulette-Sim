// Prevents form submission from reloading the page
$('form').submit(function (e) {
    e.preventDefault();
});

// Updates player shots
function UpdatePlayer(playerName) {
    const playerElement = $(`.player[data-player="${playerName.name}"]`);
    playerElement.find('.player-shots').text(`Skott skjutna: ${playerName.shots}.`);
    const player = playerName

    // if (player.shots >= player.bulletPosition) {
    //     $(this).prop('disabled', true);
    // }
}

// Reloads a player's gun
function Reload(playerName) {
    const player = map_of_players_proxy.get(playerName);
    if (!player) {
        console.error(`Player "${playerName}" not found.`);
        return;
    }

    player.shots = 0
    player.bulletPosition = Math.floor(Math.random() * 6) + 1
    UpdatePlayer(player);
};

// Reloads all guns (someday)
function ReloadAll() {}

// Shoot function
function Shoot(playerName) {
    const player = map_of_players_proxy.get(playerName);
    if (!player) {
        console.error(`Player "${playerName}" not found.`);
        return;
    }

    player.shots += 1;

    if (player.shots === player.bulletPosition) {
        console.log(`${playerName} fired shot #${player.shots} and hit the bullet!`);
        // map_of_players_proxy.delete(playerName); // Remove player
    } else {
        console.log(`${playerName} fired shot #${player.shots} and survived.`);
    }

    // IMPORTANT SO I DONT FORGET THIS
    // This is a temporary solution, currently both this and the create players function is called
    // The goal is for this only to be called, but atm that does not work.
    // Update: I really need to go through these comments, stuffs getting messy
    UpdatePlayer(player);
    // Update the map to trigger Proxy's onMapChange
    map_of_players_proxy.set(playerName, player);
}

// Event listener for reload button
$('#players').on('click', '.reload[data-player]', function () {
    const playerName = $(this).data('player');
    console.log(`${playerName} reloaded their gun.`); // DEBUG
    Reload(playerName);
    $(this).siblings('.shoot').prop('disabled', false);
    $(this).parent().siblings('.player-state').text('Levande');
    console.log($(this.closest('player-state')))
    // $(this).prop('disabled', false);
});
// Event listener for shoot button
$('#players').on('click', '.shoot[data-player]', function () {
    const playerName = $(this).data('player');
    const player = map_of_players_proxy.get(playerName)
    console.log(`Shoot button clicked for ${playerName}`); // DEBUG
    Shoot(playerName);
    if (player.shots >= player.bulletPosition) {
        $(this).prop('disabled', true);
        console.log("Button disabled") // DEBUG
    }
});

// IMPORTANT!
// All changes made to this map should instead be made to map_of_players_proxy
// This map is only managed by the proxy.
let map_of_players = new Map();
let map_of_players_proxy = map_of_players

// Creates a proxy to check for changes in the map_of_players variable
// The main purpose for this is to update the website whenever you add or remove players.
// const handler = {
//     get(target, property) {
//         if (typeof target[property] === 'function') {
//             return (...args) => {
//                 const result = target[property](...args);

//                 // Trigger onMapChange for mutating methods
//                 if (['set', 'delete', 'clear'].includes(property)) {
//                     // CreatePlayers();
//                 }

//                 return result;
//             };
//         }

//         return target[property]; // Return property for non-function keys
//     }
// };

// let map_of_players_proxy = new Proxy(map_of_players, handler);

// // Create players UI
// function CreatePlayers() {
//     $('#players').empty();
//     map_of_players_proxy.forEach((player, key) => {
//         $('#players').append(`
//             <div data-player="${key}" class="player">
//                 <div id="barrel-container">
//                     <div class="barrel">
//                         <div class="chamber ${player.shots >= 1 && player.bulletPosition > 1 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 1 ? ' lethal' : ''}"></div>
//                         <div class="chamber ${player.shots >= 2 && player.bulletPosition > 2 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 2 ? ' lethal' : ''}"></div>
//                         <div class="chamber ${player.shots >= 3 && player.bulletPosition > 3 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 3 ? ' lethal' : ''}"></div>
//                         <div class="chamber ${player.shots >= 4 && player.bulletPosition > 4 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 4 ? ' lethal' : ''}"></div>
//                         <div class="chamber ${player.shots >= 5 && player.bulletPosition > 5 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 5 ? ' lethal' : ''}"></div>
//                         <div class="chamber ${player.shots >= 6 && player.bulletPosition > 6 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 6 ? ' lethal' : ''}"></div>
//                     </div>
//                 </div>
//                 <p class="player-name">${key}</p>
//                 <p class="player-state">${player.shots >= player.bulletPosition ? 'Död' : 'Levande'}</p>
//                 <p class="player-shots">Skott skjutna: ${player.shots}.</p>
//                 <div class="button-wrapper">
//                     <button data-player="${key}" class="shoot" ${player.shots >= player.bulletPosition ? 'disabled' : ''}>Skjut</button>
//                     <button data-player="${key}" class="reload">Ladda om</button>
//                 </div>
//             </div>
//         `);
//     });
// }

// Add player on button click
$('#name-submit').click(function () {
    const playerName = $('#name').val();
    if (playerName) {
        map_of_players_proxy.set(playerName, {
            name: playerName,
            shots: 0,
            bulletPosition: Math.floor(Math.random() * 6) + 1 
        });
        // $('#players').find(('.player')).each(function(element) {
        //     console.log(element)
        //     if($('#players').contains(element)) {
        //         console.log(element)
        //         element.remove()
        //     }
        // });
        console.log(map_of_players_proxy.get(playerName))
        const player = map_of_players_proxy.get(playerName)
        console.log(player.bulletPosition)
        $('#players').append(`
            <div data-player="${player.name}" class="player">
                <div id="barrel-container">
                    <div class="barrel"> 
                        <div class="chamber ${player.shots >= 1 && player.bulletPosition > 1 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 1 ? ' lethal' : ''}"></div>
                        <div class="chamber ${player.shots >= 2 && player.bulletPosition > 2 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 2 ? ' lethal' : ''}"></div>
                        <div class="chamber ${player.shots >= 3 && player.bulletPosition > 3 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 3 ? ' lethal' : ''}"></div>
                        <div class="chamber ${player.shots >= 4 && player.bulletPosition > 4 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 4 ? ' lethal' : ''}"></div>
                        <div class="chamber ${player.shots >= 5 && player.bulletPosition > 5 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 5 ? ' lethal' : ''}"></div>
                        <div class="chamber ${player.shots >= 6 && player.bulletPosition > 6 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 6 ? ' lethal' : ''}"></div>
                    </div>
                </div>
                <p class="player-name">${player.name}</p>
                <p class="player-state">${player.shots >= player.bulletPosition ? 'Död' : 'Levande'}</p>
                <p class="player-shots">Skott skjutna: ${player.shots}.</p>
                <div class="button-wrapper">
                    <button data-player="${player.name}" class="shoot" ${player.shots >= player.bulletPosition ? 'disabled' : ''}>Skjut</button>
                    <button data-player="${player.name}" class="reload">Ladda om</button>
                </div>
            </div>
        `);
    }
    $('#name').val('')
});

// Clear all players
$('#name-clear').click(function () {
    map_of_players_proxy.clear();
    $('#players').empty().append("<p>Det finns inga spelare!</p>");
});





