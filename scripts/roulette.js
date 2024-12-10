$('form').submit(function (e) {
    e.preventDefault();
});

function SpinBarrel(player) {
    
};

function Shoot(player) {
    // if player.shots == 0, youre dead
};

const player = {
    name: "John",
    shots: 0
};

let list_of_names = []

let list_of_names_proxy = new Proxy(list_of_names, {
    set: function (target, property, value) {
        onListChange(); // Trigger whenever the list changes
        target[property] = value; // Perform the default array operation
        return true; // Indicate success
    }
});

// This function should re-generate the players whenever a change is made
function onListChange() {
    console.log("List updated")
}

$('#name-submit').click(function CreatePlayer(){
    let player = {
        name: $('#name').val(),
        shots: 1 + Math.floor(Math.random() * 6)
    }
    list_of_names_proxy.push(player)
})

$('#name-clear').click(function ClearNames(){
    list_of_names_proxy.length = 0;
})





