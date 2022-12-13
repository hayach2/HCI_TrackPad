//https://developer.mozilla.org/en-US/docs/Web/API/Touch_events#additional_tips
const ongoingTouches = [];
const number_of_tests = 10;
const time_since_started = Date.now();
let error_rate = 0;
let str = window.location.href.split(".html")[0];
let page_index = parseInt(str.charAt(str.length-1));
page_index ++;

// if cursor over the target, click to go to next text
function elementsOverlap(el1, el2) {
    const domRect1 = el1.getBoundingClientRect();
    const domRect2 = el2.getBoundingClientRect();

    return !(
        domRect1.top > domRect2.bottom ||
        domRect1.right < domRect2.left ||
        domRect1.bottom < domRect2.top ||
        domRect1.left > domRect2.right
    );
}

function euclideanDistance (x, y, home) {
    return Math.sqrt(Math.abs(x-home[1])^2+(y-home[2])^2);
}

function alert_and_navigate() {
    let time_ended = Date.now();
    let time_diff = (time_ended - time_since_started) / 1000;

    alert("Time it took to complete the task: " + time_diff + " seconds.\n" + "Error rate: " + error_rate);

    if (page_index >= number_of_tests) {
        window.location.assign("../end.html");
    } else {
        window.location.assign("test" + page_index + ".html");
    }

}


function alert_and_increment() {
    error_rate++;
    // alert("You chose the wrong target.\n" + "Error rate: " + error_rate);
    document.getElementById("my_cursor").style.top = "422px";
    document.getElementById("my_cursor").style.top = "left: 195px";

}

$(document).ready(function(){
    // let svg_colors = ["white", "green", "purple", "red", "yellow"];
    let svg_colors = ["red"];
    let random_color = svg_colors[Math.floor(Math.random()*svg_colors.length)];
    $("#color_name").text(random_color);
    $("#my_target").attr("src", "../svg/apple_" + random_color + ".svg");

    $("#restart_test").click(function(){
        window.location.assign("index.html");
    });
    const falseTarget = document.getElementsByClassName("false_target");
    for(let i = 0; i < falseTarget.length; i++) {
        const _target = document.getElementById(`target_${i}`);
        $(_target).click( function () {
            alert_and_increment();
        });
    }

    $("#my_target").click( function () {
        alert_and_navigate();
    });

    // var x = $("#my_target").position();
    // var canvas = $("#canvas").position();

    // var prompt = $("#prompt").position();
    
    $("#total_nb_of_tests").text(number_of_tests);
    $("#current_nb_of_test").text(page_index);
});


function boundChecker(elem) {
    let elem_left = parseInt(elem.style.left.replace('px', ''));
    let elem_top = parseInt(elem.style.top.replace('px', ''));

    // if (elem_left < 0) {
    //     elem.style.left = "0px";
    // } else if (elem_top < 0) {
    //     elem.style.top = "0px";
    // } else if (elem_left > 360) {
    //     elem.style.left = "360px";
    // } else if (elem_top > 613) {
    //     elem.style.top = "613px";
    // }

    // cancel action
    if ( elem_left > 360 || elem_left < 0 || elem_top > 844 || elem_top < 0) {
        console.log('here');
        //left: 195px; top: 422px;
        elem.style.left = "195px";
        elem.style.top = "422px";
    }
    console.log('nvm');
}

function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
        const id = ongoingTouches[i].identifier;

        if (id === idToFind) {
            return i;
        }
    }
    return -1;    // not found
}


function copyTouch({identifier, pageX, pageY}) {
    return {identifier, pageX, pageY};
}


function colorForTouch(touch) {
    let r = touch.identifier % 16;
    let g = Math.floor(touch.identifier / 3) % 16;
    let b = Math.floor(touch.identifier / 7) % 16;
    r = r.toString(16); // make it a hex digit
    g = g.toString(16); // make it a hex digit
    b = b.toString(16); // make it a hex digit
    const color = `#${r}${g}${b}`;
    return color;
}


function handleCancel(evt) {
    evt.preventDefault();
    console.log('touchcancel.');
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier);
        ongoingTouches.splice(idx, 1);  // remove it; we're done
    }
}


function handleEnd(evt) {
    evt.preventDefault();
    console.log("touchend");
    const el = document.getElementById('canvas');
    const ctx = el.getContext('2d');
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
        const color = colorForTouch(touches[i]);
        let idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            ctx.lineWidth = 4;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            ctx.lineTo(touches[i].pageX, touches[i].pageY);
            ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
            ongoingTouches.splice(idx, 1);  // remove it; we're done

            
            const elem = document.getElementById('my_cursor');
            const target = document.getElementById('my_target');
            const falseTarget = document.getElementsByClassName("false_target");
            
            let elem_left = parseInt(elem.style.left.replace('px', ''));
            let elem_top = parseInt(elem.style.top.replace('px', ''));
            
            console.log(falseTarget.length, "length")
            for(let i = 0; i < falseTarget.length; i++) {
                const _target = document.getElementById(`target_${i}`);
                if (elementsOverlap(elem, _target)) {
                    alert_and_increment();
                }
            }
            console.log( document.elementsFromPoint(elem_left, elem_top) )
            console.log(target, elem_left, elem_top)
            // console.log("***", falseTarget)
            if (elementsOverlap(elem, target)) {
                alert_and_navigate();
            }

            boundChecker(elem);


        } else {
            console.log('can\'t figure out which touch to end');
        }
    }
}


var timestamp = 0;
function handleMove(evt) {
    evt.preventDefault();
    const el = document.getElementById('canvas');
    const ctx = el.getContext('2d');
    const touches = evt.changedTouches;
    
    for (let i = 0; i < touches.length; i++) {
        const color = colorForTouch(touches[i]);
        const idx = ongoingTouchIndexById(touches[i].identifier);

        
        if (idx >= 0) {
            ctx.beginPath();
            
            // here!!

            const elem = document.getElementById('my_cursor');
            elem.style.display = "block";

            elem.style.position = "absolute";
            let x_movements = touches[i].pageX - ongoingTouches[idx].pageX;
            let y_movements = touches[i].pageY - ongoingTouches[idx].pageY;

            let elem_left = parseInt(elem.style.left.replace('px', ''));
            let elem_top = parseInt(elem.style.top.replace('px', ''));

            // here!!

            // X Y coordinates :: implement = dynamic gain with exponential speed exp(x-2)
            // the distance of the movement is the euclideanDistance

            var now = Date.now();

            var dt = now - timestamp;
            let distance = euclideanDistance(touches[i].pageX, touches[i].pageY, [ongoingTouches[idx].pageX, ongoingTouches[idx].pageY]);
           
            // console.log("distance:", distance);
            // console.log("dt:", dt / 1000, now / 1000, timestamp);

            var speed = (distance / dt * 1000);
            // console.log("speed:", speed);
            
            let expo = parseInt( String(Math.log(distance)) );
            let expoSpeed = parseInt( String(Math.log(speed)) );
            console.log("expo: " + expo+ ", expoSpeed: " + expoSpeed);

            // if(expoSpeed> 4) expoSpeed = 4
            console.log("expo: " + expo+ ", expoSpeed: " + expoSpeed);

            elem.style.left = (elem_left + x_movements * expoSpeed) + 'px';
            elem.style.top = (elem_top + y_movements * expoSpeed) + 'px';



            ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            // console.log(`ctx.lineTo( ${touches[i].pageX}, ${touches[i].pageY} );`);
            ctx.lineTo(touches[i].pageX, touches[i].pageY);
            ctx.lineWidth = 4;
            ctx.strokeStyle = color;
            ctx.stroke();

            // console.log(touches[i].pageX - ongoingTouches[idx].pageX);

            // mY = currentmY;
            timestamp = now;

            ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        } else {
            console.log('can\'t figure out which touch to continue');
        }
    }
}


function handleStart(evt) {
    evt.preventDefault();
    const el = document.getElementById('canvas');
    const ctx = el.getContext('2d');
    const touches = evt.changedTouches;


    for (let i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));
        const color = colorForTouch(touches[i]);
        ctx.beginPath();
        ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
        ctx.fillStyle = color;
        ctx.fill();
    }
}


function startup() {
    const el = document.getElementById('canvas');
    el.addEventListener('touchstart', handleStart);
    el.addEventListener('touchend', handleEnd);
    el.addEventListener('touchcancel', handleCancel);
    el.addEventListener('touchmove', handleMove);
    console.log('Initialized.');
}

document.addEventListener("DOMContentLoaded", startup);

// document.addEventListener("DOMContentLoaded", addFalseTargets);


var i=0;
var posx = (358).toFixed();
var posy = (0).toFixed();
var plx, ply;
function addFalseTargets() {
     i = 0;     
    var x = $("#my_target").position();
    console.log("x:", x, x.left)
    for (i=0;i<15;i++)
    {  
        let randdy = Math.floor(Math.random() * 26);
        let randdx = Math.floor(Math.random() * 10);
        console.log("randx, randy, ",randdy, randdx)
        plx = Math.abs(posx - randdx*32);
        ply = Math.abs(posy + randdy*32);
        console.log("plx, ply, ",ply, plx)
        // keep distance from target logo
        if(plx < (179+32) && plx > (179-32) ) {
            plx+=40;
        }
        // keep distance from trackpad
        if(plx < (144+102) && plx > (130) ) {
            do {
                console.log('before plx:' , plx)
                plx = i % 2 == 0 ? plx+110 : plx-110;
                // plx+=110;
                console.log('after plx:' , plx)
            } while(plx < (144+102) && plx > (130))
        }
        // keep distance from prompt
        if(ply < (365) && ply > (220) ) {
            do {
                console.log('before ply:' , ply)
                ply = i % 2 == 0 ? ply+130 : ply-130;
                // ply+=110;
                console.log('after ply:' , ply)
            } while(ply < (365) && ply > (220))
        }
        // console.log(posx, posy)
        // document.write(`
        //     <img class="false_target" id="target_${i}"  src="../svg/apple_gray.svg" alt="" width="32" height="32" title="Not-Target" 
        //     style="
        //         position: absolute;
        //         top: ${ply}px;
        //         left: ${plx}px;
        //     ">
        // `);
    }
}