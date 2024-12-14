// Create myLead array for saving purpose
let myLead = [];
let check = true;
// Create the variable to store data from local storage
let leadFromLocalStorage = JSON.parse(localStorage.getItem("myLead"));

// DOM
const inputEl = document.querySelector("#input-el");
const ulEl = document.querySelector("#ul-el");
const inputBtn = document.querySelector("#input-btn");
const tabBtn = document.querySelector("#tab-btn");
const delBtn = document.querySelector("#del-btn");

if(leadFromLocalStorage) {
    myLead = leadFromLocalStorage;
    render(myLead);
}

// Whenever we click and there's a value inside the input, render the list
inputBtn.addEventListener("click", ()=>{
    if((inputEl.value.trim().length !== 0) && checkCoincide(myLead)) {
        // Push item in myLead array
        myLead.push(inputEl.value);

        // Save the myLead array to local storage
        localStorage.setItem("myLead", JSON.stringify(myLead));

        // Render the list
        render(myLead);
    }
})

// Show save tabs url when we click to save tab
tabBtn.addEventListener("click", ()=>{
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        myLead.push(tabs[0].url);
        localStorage.setItem("myLead", JSON.stringify(myLead));
        render(myLead)
    });
})

// Delete all elements whenever we double-click delete all
delBtn.addEventListener("dblclick", ()=>{
    myLead = [];
    localStorage.clear();
    clearValue();
})

function render(list) {
    clearValue();
    // Take the text of the final index in the myLead array
    for(let i = 0; i < list.length; i++) {
        // Create elements 
        
        const liEl = document.createElement("li");
        const aEl = document.createElement("a");
        aEl.innerText = list[i];
        
        // Set atttribute of href equals to the a tag innerText and set it's opened in a new tab
        aEl.setAttribute("href", aEl.innerText);
        aEl.setAttribute("target", "_blank");

        // Ul tag append li tag, li tag append a tag
        ulEl.appendChild(liEl);
        liEl.appendChild(aEl);

    }
}

function clearValue() {
    // Clear the space inside ul tag
    ulEl.innerHTML = "";
    
    // Clear space inside input for better looking
    inputEl.value = "";
}

function checkCoincide(list)
{
    for(let i = 0; i < list.length; i++) {
        if(list[i] == inputEl.value)
        return false;
    }
    return true;
}

// Template string
// let listItems.innerHTML = `<li>
//                     <a target='_blank'> href = '${myLead[myLead.length - 1]}'> 
//                         ${myLead[myLead.length - 1]}
//                     </a>
//                 </li>`

// Truthy value: not empty string, not empty array
// Falsy value: false, 0, "", null, undefined, NaN