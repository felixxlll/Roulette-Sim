// Prevents form submission from reloading the page
$('form').submit(function (e) {
    e.preventDefault();
});

// Updates player shots
function UpdatePlayer(playerName) {
    const playerElement = $(`.player[data-player="${playerName.name}"]`);
    playerElement.find('.player-shots').text(`Skott skjutna: ${playerName.shots}.`);
    const player = playerName
}

let angle = 0

// Reloads a player's gun
function Reload(playerName) {
    const player = map_of_players_proxy.get(playerName);
    const barrel = $(`.player[data-player="${player.name}"]`).find('.barrel')
    const chambers = $(barrel).children()
    if (!player) {
        console.error(`Player "${playerName}" not found.`);
        return;
    }

    $(chambers).each(function(){
        $(this).removeClass('fired')
        $(this).removeClass('lethal')
    })

    angle = 0
    $(barrel).css("transform", `rotate(${angle}deg)`)
    
    player.shots = 0
    player.bulletPosition = Math.floor(Math.random() * 6) + 1
    UpdatePlayer(player);
};

// Reloads all guns (someday)
function ReloadAll() {}

// Shoot function
function Shoot(playerName) {
    const player = map_of_players_proxy.get(playerName);
    const playerElement = $(`.player[data-player="${player.name}"]`);
    const barrel = $(playerElement).find('.barrel')

    if (!player) {
        console.error(`Player "${playerName}" not found.`);
        return;
    }

    player.shots += 1;
    firedChamber = playerElement.find(`.chamber[data-chamber="${player.shots}"]`)

    if (player.shots === player.bulletPosition) {
        $(firedChamber).addClass('lethal')
        console.log(`${playerName} fired shot #${player.shots} and hit the bullet!`);
        $(playerElement).find('.player-state').text('Död')
        console.log($(playerElement).find('.player-state'))
    } else {
        angle += 60
        $(barrel).css("transform", `rotate(${angle}deg)`)
        $(firedChamber).addClass('fired')
        console.log(`${playerName} fired shot #${player.shots} and survived.`);
    }

    UpdatePlayer(player);
}

// Event listener for reload button
$('#players').on('click', '.reload[data-player]', function () {
    const playerName = $(this).data('player');
    console.log(`${playerName} reloaded their gun.`); // DEBUG
    Reload(playerName);
    $(this).siblings('.shoot').prop('disabled', false);
    $(this).parent().siblings('.player-state').text('Levande'); // Changes text to say player is alive
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
    }
});

// Ignore this, remnants of an old proxy solution
// I'm simply too lazy to fix this atm
let map_of_players = new Map();
let map_of_players_proxy = map_of_players

// Add player on button click
$('#name-submit').click(function () {
    const playerName = $('#name').val();
    if (map_of_players_proxy.has(playerName)) {
        $('#name').val('')
        return
    }
    else if (playerName) {
        map_of_players_proxy.set(playerName, {
            name: playerName,
            shots: 0,
            bulletPosition: Math.floor(Math.random() * 6) + 1 
        });
        const player = map_of_players_proxy.get(playerName)
        $('#players').append(`
            <div data-player="${player.name}" class="player">
                <div id="barrel-container">
                    <div class="barrel"> 
                        <div data-chamber="1" class="chamber ${player.shots >= 1 && player.bulletPosition > 1 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 1 ? ' lethal' : ''}"></div>
                        <div data-chamber="2" class="chamber ${player.shots >= 2 && player.bulletPosition > 2 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 2 ? ' lethal' : ''}"></div>
                        <div data-chamber="3" class="chamber ${player.shots >= 3 && player.bulletPosition > 3 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 3 ? ' lethal' : ''}"></div>
                        <div data-chamber="4" class="chamber ${player.shots >= 4 && player.bulletPosition > 4 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 4 ? ' lethal' : ''}"></div>
                        <div data-chamber="5" class="chamber ${player.shots >= 5 && player.bulletPosition > 5 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 5 ? ' lethal' : ''}"></div>
                        <div data-chamber="6" class="chamber ${player.shots >= 6 && player.bulletPosition > 6 ? ' fired' : ''} ${player.shots == player.bulletPosition && player.bulletPosition == 6 ? ' lethal' : ''}"></div>
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





