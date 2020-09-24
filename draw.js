let canvas = document.getElementById('cvs');
let ctx = canvas.getContext('2d');

let bodies = [
    new Body("Sun", {
        mass: bi("1.98892e30"),
        color: 'rgb(255, 255, 0)',
        size: 20,
    }),

    new Body("Earth", {
        mass: bi("5.9742e24"),
        vy: bi(29.783 * 1000),
        px: AU.multiply(-1),
        color: 'rgb(0, 255, 0)',
        size: 3
    }),

    new Body("Mars", {
        mass: bi("6.39e23"),
        vy: bi(24 * 1000),
        px: AU * -1.5,
        color: 'red',
        size: 3
    }),

    new Body("Jupiter", {
        mass: bi("1.8982e27"),
        vy: bi(13 * 1000),
        px: -5.45*AU,
        color: 'rgb(253, 106, 2)',
        size: 10,
    }),

    new Body("Saturn", {
        mass: bi("5.6834e26"),
        vy: bi(9.86 * 1000),
        px: -10 * AU,
        color: 'rgb(160, 82, 45)',
        size: 9,
    }),
    new Body("Uranus", {
        mass: bi("8.6810e25"),
        vy: bi(6.8 * 1000),
        px: -20 * AU,
        color: 'rgb(0, 0, 125)',
        size: 9,
    }),
    new Body("Neptune", {
        mass: bi("1.024e26"),
        vy: bi(5.43 * 1000),
        px: -30 * AU,
        color: 'rgb(0, 0, 255)',
        size: 9,
    }),

    new Body("Pluto", {
        mass: bi("2.2e14"),
        vy: bi(3.71 * 1000),
        px: -49.29 * AU,
        color: 'rgb(100, 100, 100)',
        size: 1,
    }),

    new Body("Moon", {
        mass: bi("7.34767309e22"),
        vy: bi(29.783 * 1000).add(1.022 * 1000),
        px: AU.multiply(-1).minus(384_400_000),
        color: 'rgb(125, 125, 125)',
        size: 1
    }),
];

// 10 pixels per astronomical unit
const SCALE = 100 / AU;
const SCALE_SIZE = SCALE / (1000 / AU)
const TIMESTEP = 24 * 60 * 60;

function draw () {
    // Make all objects apply forces.
    let forces = {};
    for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];

        let total_fx = 0;
        let total_fy = 0;
        for (let j = 0; j < bodies.length; j++) {
            const other = bodies[j];
            if (body !== other) {
                let [fx, fy] = body.resultant_force_from(other)
                
                total_fx += fx;
                total_fy += fy;
            }
        }

        forces[body.name] = [total_fx, total_fy];
    }


    for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        
        let [fx, fy] = forces[body.name];

        body.vx += fx / body.mass * TIMESTEP;
        body.vy += fy / body.mass * TIMESTEP;

        body.px += body.vx * TIMESTEP;
        body.py += body.vy * TIMESTEP;
    }
    
    // Set size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear
    let cw = canvas.getBoundingClientRect().width;
    let ch = canvas.getBoundingClientRect().height;
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, cw, ch);
    
    // First of all, find offset
    let center_x = cw / 2 // - bodies[1].px * SCALE;
    let center_y = ch / 2 // - bodies[1].py * SCALE;
    
    for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        let x = center_x + body.px * SCALE;
        let y = center_y + body.py * SCALE;
        
        ctx.fillStyle = body.color;
        ctx.strokeStyle = body.color;
        ctx.save()
        
        // Draw object
        ctx.beginPath()
        ctx.arc(center_x + body.px * SCALE, center_y + body.py * SCALE, body.size * SCALE_SIZE, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();

        // Label it.
        let dist = Math.sqrt(body.px ** 2 + body.py ** 2) / AU;
        ctx.font = "14px Operator Mono";
        ctx.fillText(
            `${body.name}: ~${(body.mass / bodies[1].mass).toLocaleString()}M⊕ at ~${(dist).toLocaleString()}AU`,
            x + body.size * SCALE_SIZE + 5,
            y
        );
    }

    ctx.fillStyle = "#0c164f";
    ctx.fillRect(0, 0, cw, ch);
    
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);