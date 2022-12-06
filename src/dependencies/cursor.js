//https://developer.mozilla.org/en-US/docs/Web/API/Touch_events#additional_tips

const ongoingTouches = [];
const number_of_tests = 6;
const time_since_started = Date.now();
let error_rate = 0;


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


let str = window.location.href.split(".html")[0];
let page_index = parseInt(str.charAt(str.length-1));

$(document).ready(function(){
    $("#restart_test").click(function(){
        window.location.assign("index.html");
    });

    $("#my_target").click( function () {
        // okkk show the time here, then wait 3 seconds
        let time_ended = Date.now();
        let time_diff = (time_ended - time_since_started) / 1000;

        // console.log("Start: " + time_since_started + ", End: " + time_ended + " ///// Difference:" + time_diff);

        alert("Time it took to complete the task: " + time_diff + " seconds.");

    });

    $("#total_nb_of_tests").text(number_of_tests);
    $("#current_nb_of_test").text(page_index);

});


function boundChecker(elem) {
    let elem_left = parseInt(elem.style.left.replace('px', ''));
    let elem_top = parseInt(elem.style.top.replace('px', ''));

    if (elem_left < 0) {
        elem.style.left = "0px";
    } else if (elem_top < 0) {
        elem.style.top = "0px";
    } else if (elem_left > 360) {
        elem.style.left = "360px";
    } else if (elem_top > 613) {
        elem.style.top = "613px";
    }
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
        } else {
            console.log('can\'t figure out which touch to end');
        }
    }
}


function handleMove(evt) {
    evt.preventDefault();
    const el = document.getElementById('canvas');
    const ctx = el.getContext('2d');
    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
        const color = colorForTouch(touches[i]);
        const idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            console.log(`continuing touch ${idx}`);
            ctx.beginPath();

            // X Y coordinates

            // here!!

            const elem = document.getElementById('my_cursor');

            elem.style.position = "absolute";
            let x_movements = touches[i].pageX - ongoingTouches[idx].pageX;
            let y_movements = touches[i].pageY - ongoingTouches[idx].pageY;

            let elem_left = parseInt(elem.style.left.replace('px', ''));
            let elem_top = parseInt(elem.style.top.replace('px', ''));

            // here!!

            boundChecker(elem);

            elem.style.left = (elem_left + x_movements) + 'px';
            elem.style.top = (elem_top + y_movements) + 'px';

            boundChecker(elem);


            ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            console.log(`ctx.lineTo( ${touches[i].pageX}, ${touches[i].pageY} );`);
            ctx.lineTo(touches[i].pageX, touches[i].pageY);
            ctx.lineWidth = 4;
            ctx.strokeStyle = color;
            ctx.stroke();

            console.log(touches[i].pageX - ongoingTouches[idx].pageX);

            ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        } else {
            console.log('can\'t figure out which touch to continue');
        }
    }
}


function handleStart(evt) {
    evt.preventDefault();
    console.log('touchstart.');
    const el = document.getElementById('canvas');
    const ctx = el.getContext('2d');
    const touches = evt.changedTouches;


    for (let i = 0; i < touches.length; i++) {
        console.log(`touchstart: ${i}.`);

        const elem = document.getElementById('my_cursor');
        const target = document.getElementById('my_target');
        let str = window.location.href.split(".html")[0];
        let page_index = parseInt(str.charAt(str.length-1));
        console.log(page_index);


        if (elementsOverlap(elem, target)) {

            // okkk show the time here, then wait 3 seconds
            let time_ended = Date.now();
            let time_diff = (time_ended - time_since_started) / 1000
            // console.log("Start: " + time_since_started + ", End: " + time_ended + " ///// Difference:" + time_diff);

            alert("Time it took to complete the task: " + time_diff + " seconds.\n" + "Error rate:" + error_rate);

            page_index ++;
            if (page_index > number_of_tests) {
                window.location.assign("../end.html");
            } else {
                window.location.assign("test" + page_index + ".html");
            }

        }

        ongoingTouches.push(copyTouch(touches[i]));
        const color = colorForTouch(touches[i]);
        console.log(`color of touch with id ${touches[i].identifier} = ${color}`);
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