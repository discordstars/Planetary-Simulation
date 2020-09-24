// bigInt object from https://github.com/peterolson/BigInteger.js
const bi = bigInt;

// Natural constants
const G = 0.0000000000667428;
let AU = bi("1.496e11");


/**
 * Number.multiply polyfill for bi interoperability
 * @param {Number} other 
 */
Number.prototype.multiply = function (other) {
    return this * other;
}


class Body {
    /**
     * Construct a body
     * @param  {any} options Options
     */
    constructor (name, options) {
        this.name = name || "Unnamed Planet";
        this.mass = options.mass || bi(0);
        this.vx = options.vx || bi(0);
        this.vy = options.vy || bi(0);
        this.px = options.px || bi(0);
        this.py = options.py || bi(0);
        
        this.size = options.size || 10;
        this.color = options.color || "#ffffff";
    }

    
    /**
     * This returns the force exerted upon this body by the other body.
     * @param {Body} other The other body to interact with
     */
    resultant_force_from (other) {
        if (this === other) {
            return [0, 0];
        }

        // Get x and y distance
        let dx = other.px - this.px;
        let dy = other.py - this.py;
        
        // Get true distance
        let d = Math.sqrt(dx**2 + dy**2);

        let result_f = (G * this.mass * other.mass) / d**2;

        let theta = Math.atan2(dy, dx);
        let fx = Math.cos(theta) * result_f;
        let fy = Math.sin(theta) * result_f;

        return [fx, fy];
    }

}


