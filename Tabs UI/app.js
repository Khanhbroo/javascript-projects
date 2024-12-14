// Using bind function for fast assigning shorthand
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const tabs = $$(".tab-item");
const panes = $$(".tab-pane");

const tabActive = $(".tab-item.active");
const line = $(".tabs .line");

// Create style whenever a tab is active
line.style.left = tabActive.offsetLeft + "px";
line.style.width = tabActive.offsetWidth + "px";

// Create onclick function for each tab
tabs.forEach((tab, index)=>{
    const pane = panes[index];
    tab.onclick = function() {
        $(".tab-item.active").classList.remove("active");
        $(".tab-pane.active").classList.remove("active");
        this.classList.add("active");
        pane.classList.add("active");
        line.style.left = this.offsetLeft + "px";
        line.style.width = this.offsetWidth + "px";
    }
})