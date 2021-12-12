import { members } from "./data.js";

let storedData = getStoredData() || members;
storeDataInMemory(storedData);
initUsers();

window.addEventListener(
  "hashchange",
  function () {
    let hash = window.location.hash;
    this.document.querySelectorAll(".wrapper-box").forEach((box) => {
      if (!box.classList.contains("hidden")) box.classList.add("hidden");
    });

    if (hash.indexOf("personal") >= 0) {
      //this.document.querySelector(".box").classList.add("hidden");
      this.document.querySelector(".personalPage").classList.remove("hidden");
      addUserData(window.location.hash.split("=")[1]);
    } else if (hash.indexOf("add-new") >= 0) {
      this.document.querySelector(".add-user-box").classList.remove("hidden");
    } else {
      this.document.querySelector(".box").classList.remove("hidden");
      //this.document.querySelector(".personalPage").classList.add("hidden");
    }
  },
  false
);

document.getElementById("submit-user").onclick = function () {
  let user = formDataToObject(document.getElementById("add-new-user"));
  addToStorage(user);
  window.location.replace("./index.html");
};

function getStoredData() {
  let users = window.localStorage.getItem("data");
  return JSON.parse(users);
}

function storeDataInMemory(data) {
  window.localStorage.setItem("data", JSON.stringify(data));
}

function initUsers() {
  let users = getStoredData();

  users.forEach((user) => {
    let userBlock = `<div class="cvbox">
    <div class="nested_box">
      <img src="./img/person-icon.jpg" alt="cvimg" class="cv_img" />
    </div>
    <div class="nested_box">
      <a href="#personal?id=${user.id}" class="cv_link">${user.firstName}</a>
    </div>
  </div>`;
    document.querySelector(".box").insertAdjacentHTML("beforeend", userBlock);
  });

  let addBlock = `<div class="cvbox">
  <div class="nested_box">
    <img src="./img/plus-icon.jpg" alt="cvimg" class="cv_img" />
  </div>
  <div class="nested_box">
    <a href="#add-new" class="cv_link"
      ><span>Add new person</span></a
    >
  </div>
</div>`;

  document.querySelector(".box").insertAdjacentHTML("beforeend", addBlock);
}

function addUserData(id) {
  const user = storedData.filter(function (data) {
    return data.id == id;
  })[0];

  document.querySelector(
    ".personName h1"
  ).innerHTML = `${user.firstName} ${user.lastName}`;
}

function formDataToObject(elForm) {
  if (!elForm instanceof Element) return;

  let fields = elForm.querySelectorAll("input, select, textarea");
  let formData = {};
  for (var i = 0, imax = fields.length; i < imax; ++i) {
    var field = fields[i],
      sKey = field.name || field.id;
    if (
      field.type === "button" ||
      field.type === "image" ||
      field.type === "submit" ||
      !sKey
    )
      continue;
    switch (field.type) {
      case "checkbox":
        formData[sKey] = +field.checked;
        break;
      case "radio":
        if (formData[sKey] === undefined) o[sKey] = "";
        if (field.checked) formData[sKey] = field.value;
        break;
      case "select-multiple":
        var a = [];
        for (var j = 0, jmax = field.options.length; j < jmax; ++j) {
          if (field.options[j].selected) a.push(field.options[j].value);
        }
        formData[sKey] = a;
        break;
      default:
        formData[sKey] = field.value;
    }
  }
  //alert("Form data:\n\n" + JSON.stringify(formData));
  return formData;
}

function addToStorage(user) {
  user.id = "id" + new Date().getTime();
  storedData.push(user);
  storeDataInMemory(storedData);
}

//   Ստեղծել single-page վեբ հավելված
//   1.Ստեղծել user object, որը կունենա անձնական տվյալների համար համապատասխան propertyները,
//   2.Այդ օբյեկտի կառուցվածքով ստեղծել ձեր խմբի անդամների տվյալների օբյեկտների զանգված:
//(զանգվածը պահել առանձին data.js ֆայլում)
//   3.Userների ամբողջ ցուցակի նախադիտարկման էջի համար ստեղծել gridի կառուցվածքով html բլոկ,
//   4.initial էջում import անել dataն, և դատայից վերցրած զանգվածի օգնությամբ ցիկլով gridի բլոկը
//գեներացնել userների gridը:
//   5: ամեն բլոկին click անելիս էջի urlը կփոխվի hash-ով(օրինակ, /#user?id=1,
// որտեղ id-ն userի id-ն է, ում անձնական էջը ցանկանում ենք տեսնել)
//6: hashchange event -ի օգնությամբ ստուգել  url-ը, և url- ից կախված այդ նույն էջում
// ցույց տալ նախապես ստեղծած CV բլոկը, փոխարենը թաքցնել ամբողջ  gridը:
// 7. DOM-ի հրամանների օգնությամբ user օբյեկտի dataն տեղադրել CV-ի բլոկի համապատասխան տեղերում:
