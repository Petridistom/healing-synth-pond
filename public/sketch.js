// // get the resume audio div
// const audio_div = document.getElementById('resume_audio')

// // get the audio context and suspend it 
// // so it doesnt start w/o user guesture
// const audio_context = new AudioContext ()
// audio_context.suspend()

// // define async function that waits for a click
// async function begin_audio () {
    
//     // wait for the audio context to resume
//     await audio_context.resume()
// }

// audio_div.onlick = e => {

//     // if audio context is not running
//     if (audio_context.state != 'running') {

//         // call the begin audio async function
//         begin_audio ()
//     }
// }

// get and format the canvas element 
const cnv = document.getElementById('particle_world')
cnv.width = cnv.parentNode.scrollWidth
cnv.height = cnv.width * 9 /16
cnv.style.backgroundColor = 'deeppink'

// // create a 'running property for
// // the cnv and set it to false
// cnv.running = false

// // on click run the click handle
// // function that begins the sketch animation
// cnv.onclick = click_handler

// // store TAU in a const
// const TAU = Math.PI * 2

// // create a vector that points to 
// // the middle of the canvas
// const center = new Vector (cnv.width / 2, cnv.height / 2)

// get a 2d context for the cnv
const ctx = cnv.getContext ('2d');

// create an array to store
// sand granules
let granules = [];

// set max amount of sand
const maxLength = 100;

// define a function that will create the 
// sand granules on click event
function spawn_sand (e) {

    // only run this code if the mouse is pressed
    addEventListener("mousedown", (e) => {
        if (granules.length < maxLength) {
            granules.push (new Sand (e.clientX, e.clientY, 10))
        }
        console.log('the mouse is pressed')
        console.log(granules)
    });

    // removes older granules so
    // new ones can spawn
     if (granules.length === maxLength) {
      granules.shift()
      }

    // use the .forEach() array method
    // to pass each granule, one at a time,
    // as an argument into the g function
    granules.forEach ((g) => {
        
    // run the functions from
    // the sand class object
    g.display ()
    g.move ()
    })
}

requestAnimationFrame(draw)
function draw () {
    spawn_sand ()
    requestAnimationFrame(draw)
}