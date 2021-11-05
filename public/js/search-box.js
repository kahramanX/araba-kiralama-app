/*class SearchBox{

    constructor(){

        let neredenBox = document.querySelector(".nereden-search-box");
        console.log(neredenBox);
    }

    eventListeners(){
        this.neredenBox.addEventListener("click", this.whenClickedSearchBox);
    }

    ekranayaz(){
        console.log("ÇALIŞAN Bİ FONKS")
    }

    whenClickedSearchBox(e){

        if (e.target.classList == "nereden-search-box") {
            console.log("tıklandı")
            console.log(e.target)
        }
        else{
            console.log("tıklanmadı")
        }
    }
}

document.addEventListener("DOMContentLoaded", function(){
    let nereden = new SearchBox();
    nereden;
})
*/
import turkey from "../api/il-api.js";

console.log(turkey.il);
let neredenBox = document.querySelector(".nereden-search-box");
console.log(neredenBox);


function eventListeners(){
    neredenBox.addEventListener("click", whenClickedSearchBox);
}

eventListeners();

function whenClickedSearchBox(e){
    if (e.target.className == "nereden-search-box") {

        e.target.children[2].remove();

        createSelectTag();
    }
}

function createSelectTag() {
    let selectSection = document.querySelector(".select-section");

    let selectElements = `<label for="provinces">İl seçin</label>
    <select name="" id="provinces">
        <option value="izmir">izmir</option>
    </select>

    <label for="districts">İlçe seçin</label>
    <select name="" id="districts">
        <option value="menemen">menemen</option>
    </select>`;

    selectSection.innerHTML = selectElements;

    /*
    <label for="provinces">İl seçin</label>
                <select name="" id="provinces">
                    <option value="izmir">izmir</option>
                </select>

                <label for="districts">İlçe seçin</label>
                <select name="" id="districts">
                    <option value="menemen">menemen</option>
                </select>
                */
}