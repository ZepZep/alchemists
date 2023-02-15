const N_RESOURCES = 8

const equationsContainer = document.getElementById("equationsContainer");
const selectorRes = document.getElementById("selector_res");
const selectorPot = document.getElementById("selector_pot");
const options = document.getElementsByClassName("option");
const addBtn = document.getElementById("addBtn");
const logBtn = document.getElementById("logBtn");
const indocator = document.getElementById("indicator");

const tableChem = document.getElementById("table-chem");

let selectedImage = null;
let equationCounter = 0;

addBtn.addEventListener("click", function () {
    addEquation();
});

logBtn.addEventListener("click", function () {
    logEquations();
});

for (let i = 0; i < options.length; i++) {
    options[i].addEventListener("click", function () {
        selectImage(this, selectedImage);
    });
}

function addEquation() {
    equationCounter++;
    const equation = document.createElement("div");
    equation.setAttribute("id", `equation${equationCounter}`);
    equation.setAttribute("class", "equation");
    // equation.classList.toggle("disabled");

    equation.innerHTML = `
        <img id="imageA${equationCounter}" src="img/res_0.png" title="0">
        <span class="sign_plus">+</span>
        <img id="imageB${equationCounter}" src="img/res_1.png" title="1">
        <a id="sign${equationCounter}" class="sign_eq">=</a>
        <img id="imageC${equationCounter}" src="img/0.png" title="0">
        <button id="disableBtn${equationCounter}" class="btn disableBtn">Disable</button>
        <button id="deleteBtn${equationCounter}" class="btn deleteBtn">Delete</button>
    `;
    equationsContainer.appendChild(equation);

    const imageA = document.getElementById(`imageA${equationCounter}`);
    const imageB = document.getElementById(`imageB${equationCounter}`);
    const imageC = document.getElementById(`imageC${equationCounter}`);
    const sign = document.getElementById(`sign${equationCounter}`);
    const disableBtn = document.getElementById(`disableBtn${equationCounter}`);
    const deleteBtn = document.getElementById(`deleteBtn${equationCounter}`);

    imageA.addEventListener("click", function () {
        openSelectorRes(imageA);
    });

    imageB.addEventListener("click", function () {
        openSelectorRes(imageB);
    });

    imageC.addEventListener("click", function () {
        openSelectorPot(imageC);
    });

    sign.addEventListener("click", function () {
        toggleSign(sign);
    });

    disableBtn.addEventListener("click", function () {
        toggleDisabled(equation);
    });

    deleteBtn.addEventListener("click", function () {
        deleteEquation(equation);
    });

    startRecalculate();
}

function openSelectorRes(selectedImageElement) {
    selectorPot.style.display = "none";
    selectorRes.style.display = "flex";
    selectedImage = selectedImageElement;
}

function openSelectorPot(selectedImageElement) {
    selectorRes.style.display = "none";
    selectorPot.style.display = "flex";
    selectedImage = selectedImageElement;
}

function selectImage(clickedOption, selectedImage) {
    selectorRes.style.display = "none";
    selectorPot.style.display = "none";
    selectedImage.src = clickedOption.src;
    selectedImage.title = clickedOption.title;
    // console.log(`Selected Image: ${clickedOption.title}`);
    startRecalculate();
}

function toggleDisabled(equation) {
    equation.classList.toggle("disabled");
    startRecalculate();
}

function toggleSign(sign) {
    if (sign.innerHTML === "=") {
        sign.innerHTML = "≠"
    } else {
        sign.innerHTML = "="
    }
    startRecalculate()
}

function deleteEquation(equation) {
    equation.remove();
    startRecalculate();
}

function logEquations() {
    startRecalculate();
}

function getConstraints() {
    let constraints = []
    const equations = document.getElementsByClassName("equation");
    for (let i = 0; i < equations.length; i++) {
        if (equations[i].classList.contains("disabled"))
            continue;

        let eqids = [
            +equations[i].children[0].title,
            +equations[i].children[2].title,
            equations[i].children[3].innerHTML,
            equations[i].children[4].title
        ];
        constraints.push(eqids);
        // console.log(`Equation ${i + 1}: ${eqids}`);
    }
    return constraints;
}

let recalculateRunning = 0
async function startRecalculate() {
    if (recalculateRunning == 0) {
        indicator.classList.replace("indicator-off", "indicator-on");
    }
    recalculateRunning++;

    await recalculate();
    // await new Promise(r => setTimeout(r, 1000));

    recalculateRunning--;
    if (recalculateRunning == 0) {
        indicator.classList.replace("indicator-on", "indicator-off");
    }
}

function createSumDisplayChem(){
    const tableSize = N_RESOURCES;

    // Header
    const row = tableChem.insertRow(0);
    for (let j = 0; j < tableSize; j++) {
        const cell = row.insertCell(j);
        innerDiv = document.createElement("div");
        cell.appendChild(innerDiv);
        const img = document.createElement("img");
        img.src = `img/res_${j}.png`;
        innerDiv.appendChild(img);
    }

    for (let i = 0; i < tableSize; i++) {
        // console.log("row", i);
        const row = tableChem.insertRow(i+1);
        for (let j = 0; j < tableSize; j++) {
            const cell = row.insertCell(j);
            cell.id = `chemCell_${i}_${j}`;

            innerDiv = document.createElement("div");
            cell.appendChild(innerDiv);

            const img = document.createElement("img");
            img.src = `img/${chemicals[i]}.png`;
            innerDiv.appendChild(img);

            const percentage = 13;
            const percentSpan = document.createElement("span");
            percentSpan.innerText = `${percentage}`;
            innerDiv.appendChild(percentSpan);

            colorCell(cell, percentage);
        }
    }
}
createSumDisplayChem();

function displaySummary(summary) {
    for (let i = 0; i < N_RESOURCES; i++) {
        for (let j = 0; j < N_RESOURCES; j++) {
            let cell = document.getElementById(`chemCell_${i}_${j}`);
            let percent = 0;
            if (summary.models === 0) {
                percent = "-";
            } else {
                percent = Math.round(100 * summary.chemicals[j][i]/ summary.models, 2);
            }
            cell.children[0].children[1].innerText = `${percent}`
            colorCell(cell, percent);
        }
    }
}

function colorCell(cell, percentage) {
    if (percentage === 0) {
        cell.style.backgroundColor = "#faa";
    } else if (percentage === 100) {
        cell.style.backgroundColor = "#afa";
    } else if (percentage === "-"){
        cell.style.backgroundColor = "#aaa";
    } else {
        cell.style.backgroundColor = "#ffa";
    }
}



