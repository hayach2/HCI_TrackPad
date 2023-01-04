
let test_count = 0;
let testsArr = [];

function getTestCount() {
    test_count = localStorage.getItem('test_count');
    return test_count;
}

function getTestPage() {
    console.log("get test page");
    test_count = localStorage.getItem('test_count');
    console.log(test_count, "test_count");
    // if(!test_count) test_count = 0;
    test_count++;

    testsArr = (localStorage.getItem('testsArr'));
    testsArr= JSON.parse(testsArr);
    if(!testsArr) testsArr = [];

    let rand = Math.floor(Math.random() * 27) + 1;

    if(typeof(testsArr) !== 'object') testsArr = [];
    console.log(testsArr, 'test array');
    if (testsArr && testsArr.includes(rand) && testsArr.length < 27) {
        do {
            console.log('in loop');
            rand = Math.floor(Math.random() * 27) + 1;
        } while(testsArr.includes(rand));
    }
    testsArr.push(rand);

    localStorage.setItem('testsArr', JSON.stringify([...testsArr]));
    localStorage.setItem('test_count', test_count);
    return rand;
}