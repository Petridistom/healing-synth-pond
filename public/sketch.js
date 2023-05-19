// get the resume audio div 
const div  = document.getElementById ('resume_audio')

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
div.onclick = e => {

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
const cnv = document.getElementById ('synth_pond')
cnv.width = innerWidth
cnv.height = innerHeight
cnv.style.backgroundColor = `#0F1F32`

// create variable cnv.running
// and set it to false
cnv.running = false

// create mouse_down variable
// and set it to false
mouse_down = false

// create a mouseX/Y variable
mouseX = 0
mouseY = 0

// assign to the onclick event listener
// the function click_handler
cnv.onclick = click_handler

// create a 2d context for the
// cnv element
const ctx = cnv.getContext ('2d')

// create an empty array for the granules
let granules = []

// call resize_window function
// resize_window ()

// call resize_window function
// when the window is resized
window.onresize = resize_window

// empty array for the synths
const synths = []

// midi notes to assign to the synths
const chord = [41, 45, 48, 53, 55, 58, 63, 68, 73, 77]

// separate the cnv into 9 collums
const w = cnv.width / 9

// for loop to create 10 synths
for (let i = 0; i < 10; i++) {

    // on the left side of first to ninth columns
    const x = i * w

    // with a side length of 90
    const len = 90

    // adjusting for the horizontal side length
    const x_adj = x - (len / 2)

    // adjusting for vertical the side length
    const y_adj = cnv.height - 90

    // create a new vector for the adjusted position
    const pos = new Vector (x_adj, y_adj)

    // get the midi note number from the chord array
    const note = chord[i]

    // push a new Synth with the defined properties
    // into the synths array
    synths.push (new Synth (pos, len, note, ctx, audio_context))
}

// define a function to draw frames
// allows animation
function draw_frame () {

    // set the fill style to dark blue
    ctx.fillStyle = `#0F1F32`

    // fill the whole canvas dark blue
    ctx.fillRect (0, 0, cnv.width, cnv.height)

    // call display_recursion function before
    // all others to display them on top
    display_recursion ()

    // for each synth, call its draw function
    synths.forEach (s => s.draw ())

    // for each granule in the array,
    // call its functions
    granules.forEach (g => {

        // call the .move () method
        g.move ()

        // call the .draw () method
        g.draw ()

        // for each synth check for
        // collisions with granules
        synths.forEach (s => {

            // check for collisions
            g.check_collision (s)
        })
    })

    // call display_pattern function
    display_pattern ()

    // call the locate_mouse function
    locate_mouse ()

    // call the bin_square function
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
    // recursion in next bit of code
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
    for (let posx = -150; posx < cnv.width +150; posx += 150) {

    // draw the recursive synths 
    recursive_square(posx, cnv.height, 100, 5)
    recursive_square(posx + 30, cnv.height, 100, 4)
    }
}

// define the click_handler async function
async function click_handler (e) {

    // if the .running property is not true
    if (!cnv.running) {

        // if the audio context is not running
        // call and wait for init_audio ()
        if (audio_context.state != 'running') await init_audio ()

        // otherwise call the make_particles function
        // passing on to it the mouse event
        make_particles (e)

        // begin the recursive draw_frame sequence off
        requestAnimationFrame (draw_frame)

        // alter the .running proprety to be true
        cnv.running = true
    }
}

// function to fill the array with Granule objects
// it will be called on mousedown later
function make_particles () {

    // executes the code inside, only
    // if the mouse is pressed
    if (mouse_down) {

        // let us know if the mouse is down
        console.log('the mouse is down')

        // use the data from the mouse click event to make
        // a new vector pointing to the location of the mouse
        const pos = new Vector (mouseX, mouseY)

            // if the granules array is not full yet
            if (granules.length < 300) {
            
            // make a vector with magnitude of 0
            const vec = new Vector (0, 0)

            // make an accelereation vector with magnitude 0
            const acc = new Vector (0, 0)            

            // add a new granule object to the granules array
            granules.push (new Granule (pos, vec, acc, ctx))
            }
        }

    // if the granules array is full
    if (granules.length === 300) {
        
        // remove the last granule
        granules.shift()
    }
}

// define a function that toggles the 
// mouse_down variable state
function toggle_mouse () {

    // listen for the mousedown event on the cnv
    cnv.addEventListener('mousedown', e => {
        
        // set mouse_down to true
        mouse_down = true
    })

    // listen for the mouseup event on the cnv
    cnv.addEventListener('mouseup', e => {
        
        // set mouse_down to false
        mouse_down = false
    })
}

// define a function that finds the mouse
// and assigns its location coordinate 
// to the global variables mouseX/Y
function locate_mouse () {

    // listen for the mousemove event on the cnv
    cnv.addEventListener('mousemove', e => {

        // set the variables mouseX/Y to the 
        // position values of the mouse
        mouseX = e.clientX
        mouseY = e.clientY
    })
}

// define a funciton that removes the sand
function bin_square () {

    // if the mouse is at the top right of the screen
    if (mouseX >= cnv.width - 120 && mouseY <= 120) {
        
        // empty the array
        granules = []

        // make the bin opaque
        ctx.fillStyle = 'rgb(18, 58, 74)'
        ctx.fillRect (cnv.width - 120, 0, 120, 120)
    }

    // draw a transparent bin
    ctx.fillStyle = 'rgba(18, 58, 74, .5)'
    ctx.fillRect (cnv.width - 120, 0, 120, 120)
}

// define a function that draws
// a pattern on the cnv
function pattern (x1, y1) {

    // begin a line
    ctx.beginPath()

    // move the drawing cursor to starting
    // points x1 and y1 - 10
    ctx.moveTo(x1, y1 - 10)

    // draw a line each time to the 
    // defined points
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

    // set the colour of the line to gold
    ctx.strokeStyle = 'rgba(218, 206, 0, 0.3)'

    // draw the line
    ctx.stroke()
}

// define a function that displays the pattern
function display_pattern () {

    // for all x positions across the cnv
    for (let x = 10; x < cnv.width + 10; x += 60) {
        
        // and for all y positions down the cnv
        for ( let y = 0; y < cnv.height; y += 60) {
           
            // draw the pattern
            pattern (x, y)
        }
    }
}

// define a function that allows
// the window to be resized
function resize_window () {
    
    // assign the cnv width and height
    // to the size of the window width 
    // and height
    cnv.width  = window.innerWidth
    cnv.height = window.innerHeight
}