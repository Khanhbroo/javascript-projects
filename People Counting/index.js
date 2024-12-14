// camelCase
var countEl = document.getElementById("count-el");
var previousEntry = document.getElementById("previous-entry");
var count = 0;
var firstTime = true;
var changed = false;

// When we click the "Increment button", change the value of count
function increment() {
    changed = true;
    count++;
    countEl.innerText = count;
}

// Save and render each time checking
function save() {
    if(firstTime)
    {
        if(count == 0)
        {
            previousEntry.textContent +=": 0";
        }
        else
        {
            previousEntry.textContent += ": " + count;
        }
        firstTime = false;
        changed = false;
    }

    if(changed)
    {
        previousEntry.innerHTML += " - " + count;
        changed = false;
    }
    count = 0;
    countEl.textContent = 0;
}