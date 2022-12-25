
let test_count = 0;
let testsArr = [];

function getTestCount() {
    test_count = localStorage.getItem('test_count');
    return test_count;
}

function getTestPage() {
    test_count = localStorage.getItem('test_count');
    test_count++;

    testsArr = (localStorage.getItem('testsArr'));
    testsArr= JSON.parse(testsArr)

    let rand = Math.floor(Math.random() * 27) + 1;

    if(typeof(testsArr) !== 'object') testsArr = [];
    if (testsArr && testsArr.includes(rand)) {
        do {
            rand = Math.floor(Math.random() * 27) + 1;
        } while(testsArr.includes(rand))
    }
    testsArr.push(rand);

    localStorage.setItem('testsArr', JSON.stringify([...testsArr]));
    localStorage.setItem('test_count', test_count);
    return rand;
}