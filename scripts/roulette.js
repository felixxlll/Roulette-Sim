$('form').submit(function (e) {
    e.preventDefault();
});

function SpinBarrel(player) {
    
};

function Shoot(player) {

};

const player = {
    name: "John",
    shots: 0
};

let list_of_names = []

$('#name-submit').click(function CreatePlayer(){
    let player = {
        name: $('#name').val(),
        shots: 1 + Math.floor(Math.random() * 6)
    }
    list_of_names.push(player)
})

function ClearNames() {
    list_of_names.length = 0;
}


