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
cnv_1.style.backgroundColor = 'black'

// create a property of that canvas element
// called "running" and store on it 
// the value "false"
cnv_1.running = false

// assign to the onclick event listener
// the function click_handler_1
cnv_1.onclick = click_handler_1

// create a new vector that points
// to the middle of the canvas
// const mid = new Vector (cnv_1.width / 2, cnv_1.height / 2)

// get a 2d context from the canvas element
const ctx = cnv_1.getContext ('2d')

// create an empty array for the particles
const particles = []

// function to fill the array with Particle objects
// we will call the function on a mouse click later
function make_particles (e) {

    cnv_1.addEventListener('mousedown', (e) => {
        console.log('the mouse is down')

    // use the data from the mouse click event to make
    // a new vector pointing to the location of the mouse
    const pos = new Vector (e.clientX, e.clientY)
    
        if (particles.length < 100) {
        
        // making a vector with magnitude of 0
        const vec = new Vector (0, 0)

        // create an accelereation vector with magnitude 0
        const acc = new Vector (0, 0)            

        console.log('the mouse is making particles')
        // add the new particle object to the particles array
        particles.push (new Particle (pos, vec, acc, ctx))
        }

        // removes particles at the 
        // end of the array to allow
        // for new particles to spawn
        if (particles.length === 100) {
            particles.shift()
        }

    })
}

    // empty array for the squares
    const squares = []

    // midi notes to assign to the squares
    const chord = [ 58, 65, 69, 72, 58, 65, 69, 72, 58, 65, 72]

    // we will cutting the canvas into 12 equal columns
    const w = cnv_1.width / 9

    // for loop to create 10 squares
    for (let i = 0; i < 10; i++) {

        // on the left side of second - fifth columns
        const x = i * w

        // with a side length of 50
        const len = 100

        // adjusting for the horizontal side length
        const x_adj = x - (len / 2)

        // adjusting for vertical the side length
        const y_adj = (cnv_1.height / 2) - (len / 2)

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

        // set the fill style to black
        ctx.fillStyle = `black`

        // fill the whole canvas with black
        ctx.fillRect (0, 0, cnv_1.width, cnv_1.height)

        // draw each square
        squares.forEach (s => s.draw ())

        // call make particles function
        // for each of the particles in the particle array
        particles.forEach (p => {

            // call the .move () method
            p.move ()

            // call the .draw () method
            p.draw ()

            // each particle must go through 
            // each of the squares to
            squares.forEach (s => {

                // check for collisions
                p.check_collision (s)
            })
        })

        // use request animation frame to call draw_frame
        // recursively, according to the frame rate, etc.
        requestAnimationFrame (draw_frame)
    }

    // async function to handle clicks
    // the event listener will pass in a mouse event
    // here we use the argument "e" to refer to that event object
    async function click_handler_1 (e) {

        // look on the canvas object
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

        // if the .running perperty is true
        else {

            // call the .toggle () method
            // on each of the squares
            // squares.forEach (s => s.toggle ())
        }
    }