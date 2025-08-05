function calc() {
    let scores = {};
    for (let c of Highcharts.charts) {
        if (c == undefined) continue;
        const nameOfSubject = c.container.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children[0].children[0].innerText;
        const subject = nameOfSubject.split(" - ")[0];
        const cleanedSubject = subject.replace("ATAR Year 12", "").trim();
        scores[cleanedSubject] = c.series[1].dataMax;
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
            listItem.innerText += ` (Bonus: ${Math.round(score * bonus * 1000) / 1000})`;
        }
        subjectCount++;
    }
    parentElement.appendChild(scoreList);

    const totalScore = document.createElement("p");
    totalScore.innerText = `TEA: ${Math.round(total * 1000) / 1000}`;
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
    return `low: ${scores.low}, q1: ${scores.q1}, median: ${scores.median}, q3: ${scores.q3}, high: ${scores.high}`;
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
            clearInterval(interval);
            makeHighChartProxy();
        }
    }, 0);
} else {
    makeHighChartProxy();
}