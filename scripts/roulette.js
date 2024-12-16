// Prevents form submission from reloading the page
$('form').submit(function (e) {
    e.preventDefault();
});

// Updates player shots
function UpdatePlayer(playerName) {
    const playerElement = $(`.player[data-player="${playerName.name}"]`);
    playerElement.find('.player-shots').text(`Skott skjutna: ${playerName.shots}.`);
}

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

    player.angle = 0
    $(barrel).css("transform", `rotate(${player.angle}deg)`)
    
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
        player.angle += 60
        $(barrel).css("transform", `rotate(${player.angle}deg)`)
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
            bulletPosition: Math.floor(Math.random() * 6) + 1,
            angle: 0 // Barrel Angle
        });
        const player = map_of_players_proxy.get(playerName)
        $('#players').append(`
            <div data-player="${player.name}" class="player">
                <div id="barrel-container">
                    <div class="barrel"> 
                        <div data-chamber="1" class="chamber"></div>
                        <div data-chamber="2" class="chamber"></div>
                        <div data-chamber="3" class="chamber"></div>
                        <div data-chamber="4" class="chamber"></div>
                        <div data-chamber="5" class="chamber"></div>
                        <div data-chamber="6" class="chamber"></div>
                        <div class="flute-container">
                            <div class="flute"></div>
                            <div class="flute"></div>
                            <div class="flute"></div>
                            <div class="flute"></div>
                            <div class="flute"></div>
                            <div class="flute"></div> 
                        </div>
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