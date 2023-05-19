// defining a class
class Granule {

    // defining the arguments for
    // instansiating the class
    constructor (position, velocity, acceleration, c_context) {

        // we will treat position, velocity, 
        // and acceleration, as vector objects
        this.pos = position
        this.vel = velocity
        this.acc = acceleration

        // define d and r for math
        // in the class' functions
        this.d   = 0
        this.r   = 0

        // give the Granules the ctx so 
        // we can style them
        this.ctx = c_context
    }

    // defining how a granule moves
    move () {

    // get random decimal
    this.r = Math.random(1)
    
    // 50% chance of running this code
    if (this.r > 0.5){
     
      // for the first ten frames
      if (0 <= this.d && this.d <= 10) {

        // randomise the x position a little bit
        // count up d by frames
        this.pos.x += Math.random(-0.0000002,0.0000002);
        this.d ++
      }

      // for the second ten frames
      if (this.d >= 10 && this.d <= 20) {

        // randomise the x position a little bit
        // in the other direction
        // count up d by frames
        this.pos.x -= Math.random(-.0000002,.0000002)
        this.d ++
      }

      // reset d to zero frames
      if (this.d >= 20) {
        this.d = 0
      }
    }
    
    // 50% chance of running
    // this code instead
    if (this.r < 0.5) {

      // increase the y postion by a little bit
      this.pos.y += 2.5
    }
    }

    // draw to canvas
    draw () {

      // getting the ctx stored on each 
      // granule, make the fill white
      this.ctx.fillStyle = `white`

      // draw the granules to the cnv
      // as rectangles with 3 x 3 dimensions
      this.ctx.fillRect (this.pos.x, this.pos.y, 3, 3)
    }

    // this method accepts a synth object as its argument
    // then checks to see whther the Granule's position
    // is inside that synth
    check_collision (s) {

        // conditional logic for the four boundaries 
        // of the synth
        const inside_l = this.pos.x > s.pos.x
        const inside_r = this.pos.x < s.pos.x + s.len
        const inside_t = this.pos.y > s.pos.y
        const inside_b = this.pos.y < s.pos.y + s.len

        // if the Granule is inside all of those boundaries
        if (inside_l && inside_r && inside_t && inside_b) {

            // call the collision method on 
            // the synth that was passed in
            s.collision ()

            // calculate the distance to the center 
            // of the synth along the x and y axes
            const x_distance = Math.abs (s.mid.x - this.pos.x)
            const y_distance = Math.abs (s.mid.y - this.pos.y)

            // x distance is larger -> horizontal collision
            // pass the synth to the x_collision method
            if (x_distance > y_distance) this.y_collision (s)

            // y distance is larger -> vertical collision
            // pass the synth to the y_collision method
            else this.y_collision (s)
        }
    }

    // defining the behaviour for a vertical collision
    y_collision (s) {
        
      // if the y velocity is positive 
      // put Granule on the bottom
      // otherwise put it on the top
      this.pos.y = this.vel.y > 0 ? s.pos.y + s.len : s.pos.y

      // give it a touch of random x velocity
      // to keep things interesting
      this.vel.x += ((Math.random () * 2) - 1) * 0.02
    }
}
