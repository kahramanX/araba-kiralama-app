import turkey from "../api/il-api.js";

// Element seçimi
let provinceSelect = document.querySelector("#provinces");
let districtSelect = document.querySelector("#districts");
let datePickerInput = document.querySelector(".datetimes");
let searchBtn = document.querySelector(".search-btn");

// event listenerlar çalışır
allEventListeners();

//Tüm evenListenerlar burada toplandı
function allEventListeners() {
    window.addEventListener('DOMContentLoaded', addProvincesToSelectTag); // tüm DOM elementleri yüklendiğinde çalışır
    provinceSelect.addEventListener("change", addDistrictsToSelectTag); 
    districtSelect.addEventListener("change", removeDisabledAttributesFromInput);
    datePickerInput.addEventListener("click", removeDisabledAttributesFromButton);
}

// Tüm sayfa yüklendikten sonra çalışır
function addProvincesToSelectTag() {

    for (let i = 0; i < turkey.length; i++) {

        let element = `<option value="${turkey[i].il}">${turkey[i].il}</option>`;

        provinceSelect.innerHTML += element; // iller select elemetine ekleniyor
    }
}

// İl seçimi yapıldığında, seçilen ile göre ilçeler eklenir
function addDistrictsToSelectTag(e) {
// province elementi her değiştiğinde bu fonksiyon çalışır
    districtSelect.disabled = false; // ilçe seçimi yapılabilmesi için, ilçe select elementi aktif edilir
    districtSelect.cursor = "default" // cursor normal hale getirilir
    districtSelect.innerHTML = ""; // her il seçiminde, ilçelerin üst üste binmemesi için districtSelectin html alanı boşaltılır

    for (let i = 0; i < turkey.length; i++) {

        if (turkey[i].il.includes(provinceSelect.value)) { // seçilen il, veritabanındaki il ile eşleşiyorsa; o ilin altındaki ilçeleri yazdıracak olan şart bloğu çalışır

            for (let j = 0; j < turkey[i].ilceler.length; j++) {

                let element = `<option value="${turkey[i].ilceler[j]}">${turkey[i].ilceler[j]}</option>`;

                districtSelect.innerHTML += element; // ilçeler select elemetine yazdırılır
            }
        }
    }
}

// İl, ilçe ve tarih seçiminin belli bir sıraya göre yapılması için ekranda tarih ve arama input elementleri önceden disabled yapılır
// bu kısımda da disabled yapılanlar sırasına göre disabled = false yapılıyor. Yani aktif hale getiriliyor
function removeDisabledAttributesFromInput() {
    datePickerInput.disabled = false;
    datePickerInput.cursor = "default";
}

function removeDisabledAttributesFromButton() {
    searchBtn.disabled = false;
    searchBtn.cursor = "pointer";
}