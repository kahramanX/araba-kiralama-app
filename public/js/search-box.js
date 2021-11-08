import turkey from "../api/il-api.js";

let provinces = turkey;

let neredenBox = document.querySelector(".nereden-search-box");


function eventListeners() {
    neredenBox.addEventListener("click", whenClickedSearchBox);
}

eventListeners();

function whenClickedSearchBox(e) {
    if (e.target.className == "nereden-search-box") {
        e.target.children[2].remove();

        createSelectTag();
    }
}
//    <option value="">${element.il}</option>

function createSelectTag() {
    let selectSection = document.querySelector(".select-section");

    let selectElement = `<label for="provinces">İl seçin</label>
    <select name="" id="provinces">
        ${addProvinces()}
    </select>`;

    selectSection.innerHTML = selectElement;
}

function addProvinces() {
    let arr = [];

    for (let i = 0; i < turkey.length; i++) {

        let element = `<option value="">${turkey[i].il}</option>`;
        
        arr.push(element);
    }
    return arr;
}