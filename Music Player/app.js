/* Pros:
    1. Render song
    2. Scroll top
    3. Play / pause / seek
    4. CD rotate
    5. Next / prev
    6. Random
    7. Next / repeat when end
    8. Active song
    9. Scroll active song into view
    10. Play song when click
*/

/* Cons:
1. Performance not good
2.  Do not have array to control the playlist when random song
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "Khanhbroo_Player";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio")
const playlist = $(".playlist");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const songs = [
    {
        name: "Gene",
        singer: "Binz",
        path: "./assets/music/binzSong1.mp3",
        image: "./assets/img/binzImage1.jpg"
    },
    {
        name: "Big City Boy",
        singer: "Binz",
        path: "./assets/music/binzSong2.mp3",
        image: "./assets/img/binzImage2.jpg"
    },
    {
        name: "Hãy trao cho anh",
        singer: "Son Tùng MTP",
        path: "./assets/music/sonTungSong1.mp3",
        image: "./assets/img/sonTungImage1.jpg"
    },
    // Duplicate songs to test handling of multiple tracks
    {
        name: "Gene",
        singer: "Binz",
        path: "./assets/music/binzSong1.mp3",
        image: "./assets/img/binzImage1.jpg"
    },
    {
        name: "Big City Boy",
        singer: "Binz",
        path: "./assets/music/binzSong2.mp3",
        image: "./assets/img/binzImage2.jpg"
    },
    {
        name: "Hãy trao cho anh",
        singer: "Son Tùng MTP",
        path: "./assets/music/sonTungSong1.mp3",
        image: "./assets/img/sonTungImage1.jpg"
    },
    {
        name: "Gene",
        singer: "Binz",
        path: "./assets/music/binzSong1.mp3",
        image: "./assets/img/binzImage1.jpg"
    },
    {
        name: "Big City Boy",
        singer: "Binz",
        path: "./assets/music/binzSong2.mp3",
        image: "./assets/img/binzImage2.jpg"
    },
    {
        name: "Hãy trao cho anh",
        singer: "Son Tùng MTP",
        path: "./assets/music/sonTungSong1.mp3",
        image: "./assets/img/sonTungImage1.jpg"
    },
]

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: songs,
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render() {
        const html = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                `
        });
        playlist.innerHTML = html.join("");
    },
    handleEvent() {
        const cdWidth = cd.offsetWidth;

        // Handle CD rotation events
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: "rotate(360deg)"
            }
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity // Infinity loops
        });

        cdThumbAnimate.pause();

        // Handle zoom in / zoom out CD Thumbnail 
        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            const opacity = newCdWidth > 0 ? newCdWidth / cdWidth : 0;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = opacity;
        }

        // Handle when clicking play 
        audio.onplay = function () {
            app.isPlaying = true;
            audio.play();
            player.classList.add("playing");
            cdThumbAnimate.play();
        }
        audio.onpause = function () {
            app.isPlaying = false;
            audio.pause();
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        }

        playBtn.onclick = function () {
            if (app.isPlaying == true) {
                // Pause the audio
                audio.onpause();
                return;
            }
            // Play the audio
            audio.onplay();
        }

        // Update progress bar
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
            }
        }

        // Handle when rewinding music
        progress.oninput = function (e) {
            const seekTime = (e.target.value * audio.duration) / 100;
            audio.currentTime = seekTime;
        }

        // Handle when clicking next song
        nextBtn.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            }
            else app.nextSong();
            audio.currentTime = 0;
            player.classList.add("playing");
            cdThumbAnimate.play();
            audio.play();
        }

        // Handle when clicking previous song
        prevBtn.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            }
            else app.prevSong();
            app.currentTime = 0;
            player.classList.add("playing");
            cdThumbAnimate.play();
            audio.play();
        }

        // Handle when clicking random song
        randomBtn.onclick = function () {
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle("active", app.isRandom); // Toggle active    
            app.setConfig("isRandom", app.isRandom);
        }

        // Handle next song when audio ended
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play();
            }
            else nextBtn.click() // Automatic click the next button
        }

        // Handle when clicking repeat song
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle("active", app.isRepeat);
            app.setConfig("isRepeat", app.isRepeat);
        }

        // Listen playlist clicking behavior
        playlist.onclick = function(e) {
            const songNode = e.target.closest(".song:not(.active)");
            // Handle when clicking into song
            if(songNode) {
                app.currentIndex = Number(songNode.dataset.index); // Use data set
                app.loadCurrentSong();
                app.render();                
                audio.play();
            }
            else if(e.target.closest(".option")) { // Handle when clicking into options
                console.log(e.target)
            }
        }
    },
    defineProperties() {
        // Define a new property for App object
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex]
            }
        });
    },
    loadCurrentSong() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        this.render();
        this.scrollToActiveSong();
    },
    nextSong() {
        this.currentIndex = (this.currentIndex + 1) % this.songs.length;
        this.loadCurrentSong();
    },
    scrollToActiveSong() {
        setTimeout(function() {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 250)
    },
    prevSong() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
        else this.currentIndex = this.songs.length - 1;
        this.loadCurrentSong();
    },
    randomSong() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    loadConfig() {
        this.isPlaying = this.config.isPlaying;
        this.isRepeat = this.config.isRepeat;                
    },
    start() {
        // Config the application
        this.loadConfig();

        // Define properties for object
        this.defineProperties();

        // Listen / handle events (DOM events)
        this.handleEvent();

        // Load the current song into UI when running app
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Render page
        randomBtn.classList.toggle("active", app.isRandom); // Toggle active    
        repeatBtn.classList.toggle("active", app.isRepeat);
    }
}

app.start();


