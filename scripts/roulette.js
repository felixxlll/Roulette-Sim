function SpinBarrel(player) {
    
};

function Shoot(player) {

};

const player = {
    name: "John",
    shots: 0
};

function CreatePlayer(name) {
    this.name = name
    this.shots = 1 + Math.floor(Math.random() * 6)
}

$('#name-submit').click(CreatePlayer('skibidi'))

list_of_names = [

]

