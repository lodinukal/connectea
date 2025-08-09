"use strict";

var calcUsable = false;


let use2024ScalingPopulation = localStorage.getItem("use2024ScalingPopulation") === "true";

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

// scaling population, scaling mean, total population total mean
const scalingPopulations = {
    "Accounting and Finance": [881, 58.2, 957, 57.4],
    "Ancient History": [96, 62.1, 100, 62.2],
    "Animal Production Systems": [31, 48.5, 34, 47.1],
    "Applied Information Technology": [272, 54.4, 304, 52.5],
    "Aviation": [31, 57.1, 35, 55.8],
    "Biology": [1478, 57.8, 1594, 57.4],
    "Business Management and Enterprise": [858, 55.3, 953, 54.7],
    "Career and Enterprise": [118, 56.4, 128, 56.0],
    "Chemistry": [4298, 63.2, 4472, 63.2],
    "Children; Family and the Community": [56, 58.0, 65, 56.8],
    "Chinese: First Language": [43, 48.6, 51, 50.5],
    "Chinese: Second Language": [60, 68.3, 73, 70.1],
    "Computer Science": [331, 58.5, 371, 57.7],
    "Dance": [71, 62.4, 100, 58.6],
    "Design": [216, 57.5, 255, 55.8],
    "Drama": [327, 60.0, 421, 58.3],
    "Earth and Environmental Science": [100, 56.4, 115, 55.5],
    "Economics": [1580, 59.9, 1672, 59.5],
    "Engineering Studies": [230, 58.3, 254, 56.9],
    "English": [8212, 58.8, 9594, 57.3],
    "English as an Additional Language or Dialect": [728, 54.0, 769, 53.7],
    "Food Science and Technology": [107, 57.0, 119, 56.2],
    "French: Second Language": [305, 68.7, 349, 68.1],
    "Geography": [1170, 55.9, 1306, 54.9],
    "German: Second Language": [16, 63.5, 18, 63.1],
    "Health Studies": [519, 54.5, 578, 53.6],
    "Human Biology": [3571, 59.3, 3819, 58.9],
    "Indonesian: Second Language": [27, 63.9, 45, 60.0],
    "Integrated Science": [40, 50.3, 45, 51.3],
    "Italian: Second Language": [154, 64.0, 175, 62.7],
    "Japanese: Second Language": [239, 66.8, 285, 67.2],
    "Literature": [1390, 66.7, 1487, 66.0],
    "Marine and Maritime Studies": [118, 56.5, 130, 55.4],
    "Materials Design and Technology": [62, 57.7, 79, 54.6],
    "Mathematics Applications": [6278, 57.2, 7736, 55.3],
    "Mathematics Methods": [3802, 64.6, 3990, 64.5],
    "Mathematics Specialist": [1246, 68.9, 1282, 68.9],
    "Media Production and Analysis": [348, 57.0, 420, 55.3],
    "Modern History": [1296, 58.5, 1413, 57.7],
    "Music": [245, 63.3, 303, 62.0],
    "Outdoor Education": [94, 54.9, 106, 53.9],
    "Philosophy and Ethics": [140, 61.5, 150, 61.3],
    "Physical Education Studies": [1134, 57.0, 1416, 55.7],
    "Physics": [2549, 62.6, 2661, 62.3],
    "Plant Production Systems": [24, 47.2, 27, 45.6],
    "Politics and Law": [705, 62.2, 765, 61.6],
    "Psychology": [1493, 58.0, 1638, 57.2],
    "Religion and Life": [869, 60.8, 903, 60.7],
    "Visual Arts": [417, 58.3, 506, 56.1],
}

const scalingStandardDeviations2024 = {
    "Accounting and Finance": 13.2,
    "Ancient History": 14.3,
    "Animal Production Systems": 14.0,
    "Applied Information Technology": 14.4,
    "Aviation": 11.5,
    "Biology": 12.9,
    "Business Management and Enterprise": 13.3,
    "Career and Enterprise": 12.4,
    "Chemistry": 13.1,
    "Children; Family and the Community": 12.0,
    "Chinese: Background Language": 11.1,
    "Chinese: First Language": 17.7,
    "Chinese: Second Language": 13.6,
    "Computer Science": 13.5,
    "Dance": 14.6,
    "Design": 13.4,
    "Drama": 13.6,
    "Earth and Environmental Science": 12.8,
    "Economics": 13.3,
    "Engineering Studies": 12.8,
    "English": 13.3,
    "English as an Additional Language or Dialect": 14.4,
    "Food Science and Technology": 12.6,
    "French: Second Language": 13.0,
    "Geography": 13.1,
    "German: Second Language": 11.9,
    "Health Studies": 13.5,
    "Human Biology": 13.1,
    "Indonesian: Second Language": 16.7,
    "Integrated Science": 14.0,
    "Italian: Second Language": 13.4,
    "Japanese: Second Language": 14.7,
    "Literature": 13.4,
    "Marine and Maritime Studies": 12.3,
    "Materials Design and Technology": 13.2,
    "Mathematics Applications": 13.1,
    "Mathematics Methods": 13.2,
    "Mathematics Specialist": 13.1,
    "Media Production and Analysis": 14.0,
    "Modern History": 13.8,
    "Music": 13.5,
    "Outdoor Education": 12.6,
    "Philosophy and Ethics": 13.1,
    "Physical Education Studies": 13.1,
    "Physics": 13.4,
    "Plant Production Systems": 14.0,
    "Politics and Law": 13.1,
    "Psychology": 13.3,
    "Religion and Life": 12.0,
    "Visual Arts": 14.4,
}

const pmodMeanDifferences = {};
for (const subject in scalingPopulations) {
    pmodMeanDifferences[subject] = 5;
}

function estimateScaled(subject, zScore) {
    // const scalingMean = pmodMeans[subject] || 0;
    const semesters = subjectExtraInfo[subject] || [];
    const semester = Object.keys(semesters).sort().reverse()[0];

    const scalingMean = semesters[semester]?.mean + pmodMeanDifferences[subject];
    const scalingStandardDeviation = scalingStandardDeviations2024[subject] || 12.0;

    return (zScore * scalingStandardDeviation) + scalingMean;
}

function doScaling(subject, zScore, rawScore, manualScaling) {
    if (manualScaling !== undefined) {
        // Apply 2024 scaling population adjustments
        return rawScore + manualScaling;
    }
    const scaledScore = estimateScaled(subject, zScore);
    return scaledScore;
}

// subject > semester > chart
const subjectCharts = {};
// subject > semester > extra info
const subjectExtraInfo = {};

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

function getSubjectExtraInfo(subject, semester) {
    if (subjectExtraInfo[subject] === undefined) {
        subjectExtraInfo[subject] = {};
    }
    if (subjectExtraInfo[subject][semester] === undefined) {
        subjectExtraInfo[subject][semester] = {};
    }
    return subjectExtraInfo[subject][semester];
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

    const scores = {};
    for (const subject in subjectExtraInfo) {
        const semesters = subjectExtraInfo[subject];
        const chosenSemester = Object.keys(semesters).sort().reverse()[0];
        const info = semesters[chosenSemester];
        scores[subject] = info.ownScore || 0;
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
        const scaling = scalingInfo[subject];
        const zScore = subjectExtraInfo[subject]?.zScore || 0;
        const scaledScore = doScaling(subject, zScore, score, use2024ScalingPopulation ? scaling : (scaling ?? 0));
        listItem.innerText = `${subject}: ${round(scaledScore)}`;
        if (top4) {
            total += scaledScore;
        }
        if (scaling !== undefined || scaledScore !== score) {
            listItem.innerText += ` (Scaling: ${round(scaledScore - score)})`;
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
    frame.id = "connectea-frame";
    frame.classList.add("closed");

    const expanderButton = document.createElement("button");
    expanderButton.id = "connectea-expanderbutton";
    expanderButton.innerText = "<";
    expanderButton.onclick = () => {
        frame.classList.toggle("closed");
        expanderButton.innerText = frame.classList.contains("closed") ? "<" : ">";
    };

    const getTeaButton = document.createElement("button");
    getTeaButton.classList.add("grow-x");
    getTeaButton.innerText = "Get TEA";
    getTeaButton.onclick = () => {
        removeScores(frame);
        const scores = overallProgress();
        displayScores(scores, frame);
    };


    const use2024ScalingPopulationCheckbox = document.createElement("input");
    use2024ScalingPopulationCheckbox.type = "checkbox";
    use2024ScalingPopulationCheckbox.id = "use-2024-scaling-population";
    use2024ScalingPopulationCheckbox.checked = use2024ScalingPopulation;
    use2024ScalingPopulationCheckbox.title = "Use 2024 Scaling Population with estimated pmod means";
    use2024ScalingPopulationCheckbox.onchange = (event) => {
        use2024ScalingPopulation = event.target.checked;
        localStorage.setItem("use2024ScalingPopulation", use2024ScalingPopulation);
    };

    const use2024ScalingPopulationLabel = document.createElement("label");
    use2024ScalingPopulationLabel.htmlFor = "use-2024-scaling-population";
    use2024ScalingPopulationLabel.innerText = "Use 2024 Scaling Population (inaccurate) ";
    use2024ScalingPopulationLabel.appendChild(use2024ScalingPopulationCheckbox);

    const teaRelatedFrame = document.createElement("div");
    teaRelatedFrame.classList.add("flex-container");

    teaRelatedFrame.appendChild(use2024ScalingPopulationLabel);
    teaRelatedFrame.appendChild(getTeaButton);

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
    displayWeightingsButton.classList.add("grow-x");
    displayWeightingsButton.innerText = "Display Weightings";
    displayWeightingsButton.title = "Show the weightings for each subject, must expand the subjects before using";
    displayWeightingsButton.onclick = () => {
        removeScores(frame);
        displayWeightings(frame);
    };

    const weightingsContainer = document.createElement("div");
    weightingsContainer.classList.add("flex-container");

    weightingsContainer.appendChild(targetPercentageInput);
    weightingsContainer.appendChild(displayWeightingsButton);

    const scalingInfoInput = document.createElement("textarea");
    scalingInfoInput.classList.add("flex-grow");
    scalingInfoInput.placeholder = "Scaling Info separated by new lines, e.g. \nEnglish: -1\nMathematics Methods: 5";

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
        const scalingPairs = scalingText.split("\n").map(pair => pair.trim());
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
    // frame.appendChild(getTeaButton);
    frame.appendChild(teaRelatedFrame);
    frame.appendChild(weightingsContainer);
    frame.appendChild(scalingInfoInput);
    frame.appendChild(clearScoresButton);
    frame.appendChild(expanderButton);
    document.body.appendChild(frame);
}
createFloatingFrame();

function estimateMean(scores) {
    // return (scores.low + scores.q1 + scores.median + scores.q3 + scores.high) / 5;
    const E = 0.003 * scores.low + 0.197 * scores.q1 + 0.6 * scores.median + 0.197 * scores.q3 + 0.003 * scores.high;
    return E;
}

function getStandardDeviation(scores) {
    const mean = estimateMean(scores);
    const squaredDifferences = [
        Math.pow(scores.low - mean, 2),
        Math.pow(scores.q1 - mean, 2),
        Math.pow(scores.median - mean, 2),
        Math.pow(scores.q3 - mean, 2),
        Math.pow(scores.high - mean, 2),
    ];
    const variance = squaredDifferences.reduce((a, b) => a + b, 0) / squaredDifferences.length;
    return Math.sqrt(variance);
}

function stringifyScores(scores) {
    const low = round(scores.low);
    const q1 = round(scores.q1);
    const median = round(scores.median);
    const estimatedMean = round(estimateMean(scores));
    const q3 = round(scores.q3);
    const high = round(scores.high);
    const sd = round(getStandardDeviation(scores));
    return `low: ${low}, q1: ${q1}, median: ${median}, mean (est): ${estimatedMean}, q3: ${q3}, high: ${high}, sd: ${sd}`;
}

function makeHighChartProxy() {
    const originalHighChart = Highcharts.Chart;
    Highcharts.Chart = function (arg) {
        const chart = new originalHighChart(arg);
        const fillXBox = arg.chart.renderTo.parentNode.parentNode.parentNode.children[0];
        const series = arg.series[0].data[0];
        const ownScore = arg.series[1].data[0];
        const sd = round(getStandardDeviation(series));
        const mean = estimateMean(series);
        const zScore = (ownScore - mean) / sd;

        const seriesInfoText = document.createElement("p");
        seriesInfoText.textContent = stringifyScores(series);
        fillXBox.appendChild(seriesInfoText);

        const zscoreText = document.createElement("p");
        zscoreText.textContent = `Estimated Z-Score: ${round(zScore, 2)}`;
        fillXBox.appendChild(zscoreText);


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
        } else {
            const actualSubjectHeader = maybeSubjectHeader
                .parentNode.parentNode.parentNode.parentNode.children[0];
            const { subject, semester, isUmbrellaSubject } = extractSubjectSemester(actualSubjectHeader.innerText);

            const info = getSubjectExtraInfo(subject, semester);
            info.zScore = zScore;
            info.chart = chart;
            info.series = series;
            info.ownScore = ownScore;
            info.zScore = zScore;
            info.mean = mean;
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

// disable for now because some devices will lag
// setTimeout(() => {
//     toggleExpandAll();
// }, 1000);