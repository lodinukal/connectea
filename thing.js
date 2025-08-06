var calcUsable = false;

const queryAllExpandButtons = `div.v-button.v-widget.eds-o-button.v-button-eds-o-button.eds-o-toggle-button.v-button-eds-o-toggle-button.eds-c-icon-button.v-button-eds-c-icon-button.eds-o-button--size-sm.v-button-eds-o-button--size-sm.eds-o-button--captionless.v-button-eds-o-button--captionless.eds-c-accordion__trigger.v-button-eds-c-accordion__trigger`;

const atarSummaryTable = [
    [30.00, 128.2],
    [40.00, 156.6],
    [50.00, 179.0],
    [55.00, 188.3],
    [60.05, 197.7],
    [61.00, 199.2],
    [62.00, 201.0],
    [63.00, 203.0],
    [64.00, 204.8],
    [65.00, 206.9],
    [66.00, 208.8],
    [67.00, 210.7],
    [68.00, 212.5],
    [69.00, 214.6],
    [70.00, 216.4],
    [71.05, 218.3],
    [72.00, 220.3],
    [73.05, 222.4],
    [74.00, 224.6],
    [75.00, 226.6],
    [76.00, 228.6],
    [77.00, 230.7],
    [78.00, 232.9],
    [79.00, 235.1],
    [80.00, 237.3],
    [81.05, 240.1],
    [82.00, 242.7],
    [83.00, 245.5],
    [84.00, 248.5],
    [85.00, 251.4],
    [86.00, 254.7],
    [87.00, 258.0],
    [88.00, 261.5],
    [89.00, 265.1],
    [90.00, 269.4],
    [91.00, 273.4],
    [92.00, 278.1],
    [93.00, 283.5],
    [94.00, 289.5],
    [95.00, 296.4],
    [96.00, 303.7],
    [97.00, 313.0],
    [98.00, 324.6],
    [98.50, 334.1],
    [99.00, 345.1],
    [99.50, 363.8],
    [99.70, 376.4],
    [99.80, 382.1],
    [99.90, 393.0],
    [99.95, 402.5],
]

// subject > semester > chart
const subjectCharts = {};

let scalingInfo = {
}

let targetPercentage = 90; // default target percentage

function getSubjectSemesterList(subject, semester) {
    if (subjectCharts[subject] === undefined) {
        subjectCharts[subject] = {};
    }
    if (subjectCharts[subject][semester] === undefined) {
        subjectCharts[subject][semester] = [];
    }
    return subjectCharts[subject][semester];
}

function extractSubjectSemester(name) {
    const parts = name.split(" - ");
    const isUmbrellaSubject = parts.length > 1 && parts[0].includes("ATAR Year 12");
    const subject = parts[0].replace("ATAR Year 12", "").trim();
    const semester = parts[1] ? parts[1].trim() : "Unknown";
    return { subject, semester, isUmbrellaSubject };
}

function round(num, precision = 3) {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
}

function overallProgress() {
    if (!calcUsable) {
        alert("Please wait for the page to load before clicking the button.");
        return {};
    }
    let semester1Scores = {};
    let semester2Scores = {};
    for (let c of Highcharts.charts) {
        if (c == undefined) continue;
        const nameOfSubject = c.container.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children[0].children[0].innerText;
        const { subject, semester, isUmbrellaSubject } = extractSubjectSemester(nameOfSubject);
        if (!isUmbrellaSubject) {
            continue;
        }

        const thisScore = c.series[1].dataMax;
        switch (semester) {
            case "Semester 1":
                semester1Scores[subject] = thisScore;
                break;
            case "Semester 2":
                semester2Scores[subject] = thisScore;
                break;
        }
    }
    for (const subject in semester1Scores) {
        if (semester2Scores[subject] === undefined) {
            semester2Scores[subject] = semester1Scores[subject];
        }
    }
    return semester2Scores;
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

function getATARScore(score) {
    if (score < 30) return 0;
    for (const [atarScore, threshold] of atarSummaryTable) {
        if (score < threshold) {
            return atarScore;
        }
    }
    return 99.95; // maximum ATAR score
}

// when button is clicked, make a list of scores above the button ordered
function displayScores(scores, parentElement) {
    const scoreList = document.createElement("ul");
    scoreList.classList.add("garbage");
    // order the scores by value
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    let total = 0;
    let subjectCount = 0;
    for (const [subject, score] of sortedScores) {
        const listItem = document.createElement("li");
        scoreList.appendChild(listItem);
        const top4 = subjectCount < 4;
        const bonus = bonusSubjects[subject];
        const scaling = scalingInfo[subject] || 0;
        const scaledScore = score + scaling;
        listItem.innerText = `${subject}: ${round(scaledScore)}`;
        if (top4) {
            total += scaledScore;
        }
        if (scaling) {
            listItem.innerText += ` (Scaling: ${scaling})`;
        }
        if (bonus) {
            total += scaledScore * bonus;
            listItem.innerText += ` (Bonus: ${round(scaledScore * bonus)})`;
        }
        subjectCount++;
    }
    parentElement.appendChild(scoreList);

    const atarScore = getATARScore(total);

    const totalScore = document.createElement("p");
    totalScore.innerText = `TEA: ${round(total)} (ATAR: ${atarScore})`;
    totalScore.classList.add("garbage");
    parentElement.appendChild(totalScore);
}

function displayWeightings(parentElement) {
    const scores = {};
    for (const subject in subjectCharts) {
        const semesters = subjectCharts[subject];
        // choose the latest semester
        const latestSemester = Object.keys(semesters).sort().reverse()[0];
        const list = subjectCharts[subject][latestSemester];
        if (list.length === 0) continue;

        const totalWeightGot = list.reduce((acc, item) => acc + item.weightGot, 0);
        const totalWeight = list.reduce((acc, item) => acc + item.weight, 0);
        const remainingWeight = 100 - totalWeight;

        // calculate how much weight is left to get targetPercentage% in the subject
        const weightNeeded = targetPercentage - totalWeightGot;
        const percentageNeeded = weightNeeded / remainingWeight * 100;

        const scenario100percent = totalWeightGot + remainingWeight;

        let chosenText = "";
        if (percentageNeeded > 100) {
            chosenText = `If you get 100% in the next assessments, you'll get ${round(scenario100percent)}% in the subject.`;
            scores[subject] = round(scenario100percent);
        } else if (percentageNeeded < 0) {
            chosenText = `You already have enough score to get ${round(targetPercentage)}% in the subject even if you get 0% in the next assessments.`;
            scores[subject] = targetPercentage;
        } else {
            chosenText = `You need ${round(percentageNeeded)}% avg in the next assessments to get ${round(targetPercentage)}%.`;
            scores[subject] = targetPercentage;
        }

        const textNode = document.createElement("div");
        textNode.innerText = `${subject} \
                    ${round(totalWeightGot)} / ${round(totalWeight)} (${round(totalWeightGot / totalWeight * 100, 2)}%); \
                    ${chosenText}`;
        textNode.classList.add("garbage");
        parentElement.appendChild(textNode);
    }

    displayScores(scores, parentElement);
}

function removeScores(parentElement) {
    const garbage = parentElement.querySelectorAll(".garbage");
    garbage.forEach(item => parentElement.removeChild(item));
}

function toggleExpandAll() {
    const buttons = document.querySelectorAll(queryAllExpandButtons);
    for (const button of buttons) {
        button.click();
    }
}

function createFloatingFrame() {
    const frame = document.createElement("div");
    frame.style.position = "fixed";
    frame.style.bottom = "10px";
    frame.style.right = "10px";
    frame.style.backgroundColor = "white";
    frame.style.border = "1px solid #ddd";
    frame.style.padding = "20px";
    frame.style.borderRadius = "8px";
    frame.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    frame.style.marginBottom = "20px";
    frame.style.transition = "box-shadow 0.2s";
    frame.style.display = "flex";
    frame.style.flexDirection = "column";
    frame.style.gap = "10px";

    frame.style.zIndex = 1000;

    const button = document.createElement("button");
    button.innerText = "Get TEA";
    button.onclick = () => {
        removeScores(frame);
        const scores = overallProgress();
        displayScores(scores, frame);
    };

    const expandAllButton = document.createElement("button");
    expandAllButton.innerText = "Toggle All";
    expandAllButton.onclick = () => {
        toggleExpandAll();
    };

    const clearScoresButton = document.createElement("button");
    clearScoresButton.innerText = "Clear";
    clearScoresButton.onclick = () => {
        removeScores(frame);
    };

    // put display weightings button inline with an input field for target percentage
    const targetPercentageInput = document.createElement("input");
    targetPercentageInput.type = "number";
    targetPercentageInput.value = targetPercentage;

    const storedTargetPercentage = localStorage.getItem("targetPercentage");
    if (storedTargetPercentage) {
        targetPercentage = parseFloat(storedTargetPercentage);
        targetPercentageInput.valueAsNumber = targetPercentage;
    }

    targetPercentageInput.onchange = (event) => {
        targetPercentage = parseFloat(event.target.value);
        localStorage.setItem("targetPercentage", targetPercentage);
    };

    const displayWeightingsButton = document.createElement("button");
    displayWeightingsButton.innerText = "Display Weightings";
    displayWeightingsButton.style.flexGrow = "1";
    displayWeightingsButton.style.flexShrink = "0";
    displayWeightingsButton.onclick = () => {
        removeScores(frame);
        displayWeightings(frame);
    };

    const weightingsContainer = document.createElement("div");
    weightingsContainer.style.display = "flex";
    weightingsContainer.style.alignItems = "center";
    weightingsContainer.style.gap = "10px";

    weightingsContainer.appendChild(targetPercentageInput);
    weightingsContainer.appendChild(displayWeightingsButton);

    const scalingInfoInput = document.createElement("textarea");
    scalingInfoInput.placeholder = "Scaling Info, e.g. `Mathematics Specialist: -1; Mathematics Methods: 5`";
    scalingInfoInput.style.width = "100%";
    scalingInfoInput.style.marginTop = "10px";
    // make multiline
    scalingInfoInput.style.height = "100px";
    scalingInfoInput.style.resize = "vertical";

    // try loading scaling info from localStorage
    const storedScalingInfo = localStorage.getItem("scalingInfo");
    if (storedScalingInfo) {
        scalingInfo = JSON.parse(storedScalingInfo);
        scalingInfoInput.value = Object.entries(scalingInfo)
            .map(([subject, value]) => `${subject}: ${value}`)
            .join("; ");
    }

    scalingInfoInput.onchange = (event) => {
        const scalingText = event.target.value;
        const scalingPairs = scalingText.split(";").map(pair => pair.trim());
        scalingInfo = {};
        for (const pair of scalingPairs) {
            const [subject, value] = pair.split(":").map(part => part.trim());
            if (subject && value) {
                scalingInfo[subject] = parseFloat(value);
            }
        }
        localStorage.setItem("scalingInfo", JSON.stringify(scalingInfo));
    }

    frame.appendChild(expandAllButton);
    frame.appendChild(button);
    frame.appendChild(weightingsContainer);
    frame.appendChild(scalingInfoInput);
    frame.appendChild(clearScoresButton);
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
        const fillXBox = arg.chart.renderTo.parentNode.parentNode.parentNode.children[0];
        const series = arg.series[0].data[0];
        const textNode = document.createTextNode(stringifyScores(series));
        fillXBox.appendChild(textNode);

        // check subject
        const maybeSubjectHeader = fillXBox.parentNode.parentNode.children[0];
        if (maybeSubjectHeader.classList.contains("cvr-c-task-group")) {
            const actualSubjectHeader = maybeSubjectHeader.parentNode.parentNode
                .parentNode.parentNode.parentNode
                .parentNode.parentNode.parentNode.parentNode.children[0];
            const { subject, semester, isUmbrellaSubject } = extractSubjectSemester(actualSubjectHeader.innerText);

            const weightParent = arg.chart.renderTo.parentNode.parentNode.children[0].children[1].children[0].children[0];
            const weightGot = parseFloat(weightParent.children[0].innerText);
            const weight = parseFloat(weightParent.children[1].innerText.replace("Out of ", ""));

            const list = getSubjectSemesterList(subject, semester);
            list.push({
                chart,
                weightGot,
                weight,
            });
        }

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

setTimeout(() => {
    toggleExpandAll();
}, 1000);