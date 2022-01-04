import turkey from "../api/il-api.js";

let provinceSelect = document.querySelector("#provinces");
let districtSelect = document.querySelector("#districts");
let datePickerInput = document.querySelector(".datetimes");
let searchBtn = document.querySelector(".search-btn");

allEventListeners();

function allEventListeners() {
    window.addEventListener('DOMContentLoaded', addProvincesToSelectTag);
    provinceSelect.addEventListener("change", addDistrictsToSelectTag);
    districtSelect.addEventListener("change", removeDisabledAttributesFromInput);
    datePickerInput.addEventListener("click", removeDisabledAttributesFromButton);
}


function addProvincesToSelectTag() {

    for (let i = 0; i < turkey.length; i++) {

        districtSelect.innerHTML = "";
        districtSelect.innerHTML = `<option value="İlçe seç" disabled selected>İlçe Seç</option>`;

        let element = `<option value="${turkey[i].il}">${turkey[i].il}</option>`;

        provinceSelect.innerHTML += element;
    }
}

function addDistrictsToSelectTag(e) {

    districtSelect.disabled = false;
    districtSelect.cursor = "default"

    for (let i = 0; i < turkey.length; i++) {

        if (turkey[i].il.includes(provinceSelect.value)) {

            for (let j = 0; j < turkey[i].ilceler.length; j++) {

                let element = `<option value="${turkey[i].ilceler[j]}">${turkey[i].ilceler[j]}</option>`;

                districtSelect.innerHTML += element;
            }
        }
    }
}

function removeDisabledAttributesFromInput() {
    datePickerInput.disabled = false;
    datePickerInput.cursor = "default";
}

function removeDisabledAttributesFromButton() {

    console.log("çalıştı mı")
    searchBtn.disabled = false;
    searchBtn.cursor = "pointer";
}