// get the resume audio div 
const div_0  = document.getElementById ('resume_audio')

// get and suspend audio context
const audio_context = new AudioContext ()
audio_context.suspend ()

// define an async click handler function 
async function init_audio () {

// wait for audio context to resume
await audio_context.resume ()
}

// pass anonymous function to the .onclick property
// of the div element
div_0.onclick = e => {

// if audio context is not running
if (audio_context.state != 'running') {
    
    // call the async init audio function
    init_audio ()
}
}

// remove padding and scroll bar
document.body.style.margin = 0
document.body.style.overflow = 'hidden'

// get and format the canvas element
const cnv_1 = document.getElementById ('particle_example')
cnv_1.width = innerWidth
cnv_1.height = innerHeight
cnv_1.style.backgroundColor = 'magenta'

// create variable cnv_1.running
// and set it to false
cnv_1.running = false

// create mouse_down variable
// and set it to false
mouse_down = false

// create a mouseX/y variable
mouseX = 0
mouseY = 0

// assign to the onclick event listener
// the function click_handler_1
cnv_1.onclick = click_handler

// get a 2d context from the canvas element
const ctx = cnv_1.getContext ('2d')

// create an empty array for the particles
let particles = []

// empty array for the squares
const squares = []

// midi notes to assign to the squares
const chord = [41, 45, 48, 53, 55, 58, 63, 68, 73, 77]

// we will cutting the canvas into 12 equal columns
const w = cnv_1.width / 9

// for loop to create 10 squares
for (let i = 0; i < 10; i++) {

    // on the left side of second - ninth columns
    const x = i * w

    // with a side length of 90
    const len = 90

    // adjusting for the horizontal side length
    const x_adj = x - (len / 2)

    // adjusting for vertical the side length
    const y_adj = cnv_1.height - 90

    // create a new vector for the adjusted position
    const pos = new Vector (x_adj, y_adj)

    // get the midi note number from the chord array
    const note = chord[i]

    // pass the adjusted position, side length, chord note
    // canvas context & audio context to the class constructor
    // to return a new object of that class
    // and push it into the squares array
    squares.push (new Sound_Square (pos, len, note, ctx, audio_context))
}

// define a function to draw frames
function draw_frame () {

    // set the fill style to dark blue
    ctx.fillStyle = `#0F1F32`

    // fill the whole canvas with black
    ctx.fillRect (0, 0, cnv_1.width, cnv_1.height)

    // call display_recursion function
    display_recursion ()

    // draw each square
    squares.forEach (s => s.draw ())

    // call make particles function
    // for each of the particles in the particle array
    particles.forEach (p => {

        // call the .move () method
        p.move ()

        // call the .draw () method
        p.draw ()

        // for each particle and square
        // check for collisions
        squares.forEach (s => {

            // check for collisions
            p.check_collision (s)
        })
    })

    // call pattern function
    display_pattern ()

    //call the locate_mouse function
    locate_mouse ()

    // call double_click function
    empty ()

    // call bin_square function
    bin_square ()

    // call the toggle_mouse function
    toggle_mouse ()

    // call make_particles function
    make_particles ()

    // use request animation frame to call draw_frame
    // recursively, according to the frame rate, etc.
    requestAnimationFrame (draw_frame)
}

// define a function to draw recursive squares
function recursive_square(x, y, s, l) { 

    // set the stroke to lightblue
    ctx.strokeStyle = 'lightblue'

    // draw a rectangle with
    // given parameters
    ctx.strokeRect(x, y, s, l)

    // state an end clause for
    // recursion in next code
    if (s > 15) {

    // call the recursive_square
    // function to make the design
    // at the bottom of the screen
    recursive_square(x + s *0.5, y + s*0.5, s *0.5, l);
    recursive_square(x - s *0.5, y + s*0.5, s *0.5, l);
    recursive_square(x - s *0.5, y - s*0.5, s *0.5, l);
    recursive_square(x + s *0.5, y - s*0.5, s *0.5, l);    
    }
}

// define a function to display the recursive squares
function display_recursion() {

    // for each position along the x axis
    for (let posx = -150; posx < cnv_1.width +150; posx += 150) {

    // draw the recursive squares 
    recursive_square(posx, cnv_1.height, 100, 5)
    recursive_square(posx + 30, cnv_1.height, 100, 4)
    }
}

// define the click_handler async function
async function click_handler (e) {

    // if the .running property is not true
    if (!cnv_1.running) {

        // if the audio context is not running
        // call and wait for init_audio ()
        if (audio_context.state != 'running') await init_audio ()

        // otherwise call the make_particles function
        // passing on to it the mouse event
        make_particles (e)

        // begin the recursive draw_frame sequence off
        requestAnimationFrame (draw_frame)

        // alter the .running proprety to be true
        cnv_1.running = true
    }
}

// function to fill the array with Particle objects
// we will call the function on a mouse click later
function make_particles () {

    // executes the code inside only
    // if the mouse is pressed
    if (mouse_down) {

        console.log('the mouse is down')

        // use the data from the mouse click event to make
        // a new vector pointing to the location of the mouse
        const pos = new Vector (mouseX, mouseY)
        
            if (particles.length < 300) {
            
            // making a vector with magnitude of 0
            const vec = new Vector (0, 0)

            // create an accelereation vector with magnitude 0
            const acc = new Vector (0, 0)            

            // console.log('the mouse is making particles')
            // add the new particle object to the particles array
            particles.push (new Particle (pos, vec, acc, ctx))
            }
        }

    // removes particles at the 
    // end of the array to allow
    // for new particles to spawn
    if (particles.length === 300) {
        particles.shift()
    }
}

// define a function that toggles the 
// mouse_down variable state
function toggle_mouse () {
    cnv_1.addEventListener('mousedown', e => {
        mouse_down = true
    })

    cnv_1.addEventListener('mouseup', e => {
        mouse_down = false
    })
}

// define a function that finds the mouse
// and assigns its location coordinate 
// to the global variables mouseX/Y
function locate_mouse () {
    cnv_1.addEventListener('mousemove', e => {
        mouseX = e.clientX
        mouseY = e.clientY
    })
}

// define a function to empty the
// particles array
function empty () {

    // if the mouse is at the top right of the screen
    if (mouseX >= cnv_1.width - 120 && mouseY <= 120) {
        // empty the array
        particles = []
        ctx.fillStyle = 'rgb(18, 58, 74)'
        ctx.fillRect (cnv_1.width - 120, 0, 120, 120)
    }
}

function bin_square () {
    ctx.fillStyle = 'rgba(18, 58, 74, .5)'
    ctx.fillRect (cnv_1.width - 120, 0, 120, 120)
}

function pattern (x1, y1) {

    ctx.beginPath()

    ctx.moveTo(x1, y1 - 10)

    ctx.lineTo(x1     , y1     )
    ctx.lineTo(x1 + 40, y1 + 00)
    ctx.lineTo(x1 + 40, y1 + 50)
    ctx.lineTo(x1 + 00, y1 + 50)
    ctx.lineTo(x1 + 00, y1 + 10)
    ctx.lineTo(x1 + 30, y1 + 10)
    ctx.lineTo(x1 + 30, y1 + 40)
    ctx.lineTo(x1 + 10, y1 + 40)
    ctx.lineTo(x1 + 10, y1 + 20)
    ctx.lineTo(x1 + 20, y1 + 20)
    ctx.lineTo(x1 + 20, y1 + 30)

    ctx.strokeStyle = 'rgba(218, 206, 0, 0.3)'

    ctx.stroke()
}

function display_pattern () {

for (let x = 10; x < cnv_1.width + 10; x += 60) {
    for ( let y = 0; y < cnv_1.height; y += 60) {
        pattern (x, y)
    }
}
}