const bondsOf = getParam('bondsOf');
const missingPart = getParam('missing');

const MAX_DIGITS = bondsOf.toString().length;
const ANSWER_REGEX = '^(?:0*)(?=0)?0?([0-9]{1,' + MAX_DIGITS + '})';

var SETS_TO_GIVE = [];
var CURRENT_ANSWER = null;

(async () => {
    generateSets(bondsOf, missingPart);
    newSet();
})();

function getParam(param) {
    var val = new URL(document.URL).searchParams.get(param);
    if(val != null)
        return val;
    return 0;
}

function generateSets(bondsOf, missingPart) {
    for(i = 0; i <= bondsOf; i++) {
        p1 = i;
        p2 = bondsOf - i;
        p3 = bondsOf;
        if(missingPart == 0) {
            SETS_TO_GIVE.push([`?${p1}`, '+', p2, '=', p3]);
        } else if(missingPart == 1) {
            SETS_TO_GIVE.push([p1, '+', `?${p2}`, '=', p3]);
        } else if(missingPart == 2) {
            SETS_TO_GIVE.push([p1, '+', p2, '=', `?${p3}`]);
        }
    }
}

function newSet() {
    var equation = document.getElementById('equation');
    while(equation.firstChild)
        equation.removeChild(equation.firstChild);
    if(SETS_TO_GIVE.length == 0)
        return null;
    var set = SETS_TO_GIVE.splice(Math.floor(Math.random() * SETS_TO_GIVE.length), 1)[0];
    
    set.forEach(e => {
        var node = document.createElement('li');
        if(String(e).startsWith('?')) {
            var input = document.createElement('input');
            input.id = 'answer';
            input.type = 'number';
            input.placeholder = '?';
            input.autofocus = true;
            CURRENT_ANSWER = String(e).substring(1);
            input.setAttribute('oninput', 'value = validateNumberFormat(value)');
            node.appendChild(input);
        } else {
            node.innerHTML = e;
        }
        document.getElementById('equation').appendChild(node);
    })
    document.getElementById('answer').focus();
    setAnswerBoxWidth();
}

function validateNumberFormat(value) {
    var reg = value.match(ANSWER_REGEX);
    if(reg == null) {
        return '';
    }
    return reg[1];
}

function checkAnswer() {
    var box = document.getElementById('answer');
    if(box.value == CURRENT_ANSWER) {
        box.value = '';
        addScore(1);
        newSet();
    }
}

function addScore(amt) {
    score = document.getElementById('score');
    score.innerHTML = Number(score.innerHTML) + amt;
}

function setAnswerBoxWidth() {
    var box = document.getElementById('answer');
    box.style.width = (MAX_DIGITS + 1) + 'ch';
}

document.addEventListener('keyup', function(event) {
    if (event.code == 'Enter') {
        checkAnswer();
    }
});