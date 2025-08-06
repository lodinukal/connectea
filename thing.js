var calcUsable = false;

function round(num, precision = 3) {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
}

function calc() {
    if (!calcUsable) {
        alert("Please wait for the page to load before clicking the button.");
        return {};
    }
    let semester1Scores = {};
    let scores = {};
    for (let c of Highcharts.charts) {
        if (c == undefined) continue;
        const nameOfSubject = c.container.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children[0].children[0].innerText;
        const subject = nameOfSubject.split(" - ")[0];
        const semester = nameOfSubject.split(" - ")[1];
        // needs "ATAR Year 12" otherwise its not a valid subject
        if (!subject.includes("ATAR Year 12")) {
            continue;
        }

        const cleanedSubject = subject.replace("ATAR Year 12", "").trim();
        const thisScore = c.series[1].dataMax;
        // prefer not to use the semester 1 score
        if (semester === "Semester 1") {
            semester1Scores[cleanedSubject] = thisScore;
            continue;
        }
        scores[cleanedSubject] = thisScore;
    }
    for (const subject in semester1Scores) {
        if (scores[subject] === undefined) {
            scores[subject] = semester1Scores[subject];
        }
    }
    return scores;
}

// add any bonus subjects here
const bonusSubjects = {
    "Japanese: Second Language": 0.10,
    "Chinese: Second Language": 0.10,
    "French: Second Language": 0.10,
    "Italian: Second Language": 0.10,
    "Chinese: Background Language": 0.10,
    "Mathematics Methods": 0.10,
    "Mathematics Specialist": 0.10,
}

// when button is clicked, make a list of scores above the button ordered
function displayScores(scores, parentElement) {
    const scoreList = document.createElement("ul");
    // order the scores by value
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    let total = 0;
    let subjectCount = 0;
    for (const [subject, score] of sortedScores) {
        const listItem = document.createElement("li");
        listItem.innerText = `${subject}: ${score}`;
        scoreList.appendChild(listItem);
        const top4 = subjectCount < 4;
        const bonus = bonusSubjects[subject];
        if (top4) {
            total += score;
        }
        if (bonus) {
            total += score * bonus;
            listItem.innerText += ` (Bonus: ${round(score * bonus)})`;
        }
        subjectCount++;
    }
    parentElement.appendChild(scoreList);

    const totalScore = document.createElement("p");
    totalScore.innerText = `TEA: ${round(total)}`;
    parentElement.appendChild(totalScore);
}


function removeScores(parentElement) {
    const scoreList = parentElement.querySelector("ul");
    if (scoreList) {
        parentElement.removeChild(scoreList);
    }
    const totalScore = parentElement.querySelector("p");
    if (totalScore) {
        parentElement.removeChild(totalScore);
    }
}

function createFloatingFrame() {
    const frame = document.createElement("div");
    frame.style.position = "fixed";
    frame.style.bottom = "10px";
    frame.style.right = "10px";
    frame.style.backgroundColor = "white";
    frame.style.border = "1px solid black";
    frame.style.padding = "10px";
    frame.style.zIndex = 1000;

    const button = document.createElement("button");
    button.innerText = "Calculate Scores";
    button.onclick = () => {
        removeScores(frame);
        const scores = calc();
        displayScores(scores, frame);
    };

    frame.appendChild(button);
    document.body.appendChild(frame);
}
createFloatingFrame();

function stringifyScores(scores) {
    const low = round(scores.low);
    const q1 = round(scores.q1);
    const median = round(scores.median);
    const q3 = round(scores.q3);
    const high = round(scores.high);
    return `low: ${low}, q1: ${q1}, median: ${median}, q3: ${q3}, high: ${high}`;
}

function makeHighChartProxy() {
    const originalHighChart = Highcharts.Chart;
    Highcharts.Chart = function (arg) {
        const chart = new originalHighChart(arg);
        const renderTo = arg.chart.renderTo.parentNode.parentNode.parentNode.children[0];
        const series = arg.series[0].data[0];
        const textNode = document.createTextNode(stringifyScores(series));
        renderTo.appendChild(textNode);
        return chart;
    };
}

// wait until Highcharts is loaded then run the proxy function
if (typeof Highcharts === "undefined") {
    const interval = setInterval(() => {
        if (typeof Highcharts !== "undefined") {
            calcUsable = true;
            clearInterval(interval);
            makeHighChartProxy();
        }
    }, 0);
} else {
    makeHighChartProxy();
}