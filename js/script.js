const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio = wrapper.querySelector("#main-audio"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

window.addEventListener("load", ()=>{
  loadMusic(musicIndex);
  playingNow();
});

function loadMusic(indexNumb){
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `album photos/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `music lists/${allMusic[indexNumb - 1].src}.mp3`;
}

function playMusic(){
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

playPauseBtn.addEventListener("click", ()=>{
  const isMusicPlay = wrapper.classList.contains("paused");
  isMusicPlay ? pauseMusic() : playMusic();
});


nextBtn.addEventListener("click", ()=>{
    nextMusic();
});

prevBtn.addEventListener("click", ()=>{
    prevMusic();
});

mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;
  
  let musicCurrentTime = wrapper.querySelector(".current-time");
  let musicDuration = wrapper.querySelector(".max-duration");

  mainAudio.addEventListener("loadeddata", ()=>{

    let audioDuration = mainAudio.duration;
    let totalMinute = Math.floor(audioDuration / 60);
    let totalSecond = Math.floor(audioDuration % 60);
    if(totalSecond < 10) {
      totalSecond = `0${totalSecond}`;
    }
    musicDuration.innerText = `${totalMinute}:${totalSecond}`;

  });

  let currentMinute = Math.floor(currentTime / 60);
  let currentSecond = Math.floor(currentTime % 60);
  if(currentSecond < 10) {
    currentSecond = `0${currentSecond}`;
  }
  musicCurrentTime.innerText = `${currentMinute}:${currentSecond}`;
});

progressArea.addEventListener("click", (e)=>{
  let progressWidthVal = progressArea.clientWidth;
  let clickedOffSetX = e.offsetX;
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
  playMusic(); 
});

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText;

  switch(getText) {
    case "repeat": 
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    
      case "repeat_one": 
        repeatBtn.innerText = "shuffle";
        repeatBtn.setAttribute("title", "Playback shuffle");
        break;

      case "shuffle": 
        repeatBtn.innerText = "repeat";
        repeatBtn.setAttribute("title", "Playlist looped");
        break;  
  }
});

mainAudio.addEventListener("ended", ()=>{
  let getText = repeatBtn.innerText;

  switch(getText) {
    case "repeat": 
      nextMusic();
      break;
    
      case "repeat_one": 
        mainAudio.currentTime = 0;
        loadMusic(musicIndex);
        playMusic();
        break;

      case "shuffle": 
        let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        } while (randIndex == musicIndex);
        musicIndex = randIndex;
        loadMusic(musicIndex);
        playMusic();
        playingNow();
        break;  
  }
});

//show music list onclick of music icon
moreMusicBtn.addEventListener("click", ()=>{
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", ()=>{
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {
let liTag = `<li li-index="${i + 1}">
              <div class="row">
                <span>${allMusic[i].name}</span>
                <p>${allMusic[i].artist}</p>
              </div>
              <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
              <audio class="${allMusic[i].src}" src="music lists/${allMusic[i].src}.mp3"></audio>
            </li>`;
ulTag.insertAdjacentHTML("beforeend", liTag); 

let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

liAudioTag.addEventListener("loadeddata", ()=>{
  let duration = liAudioTag.duration;
  let totalMin = Math.floor(duration / 60);
  let totalSec = Math.floor(duration % 60);
  if(totalSec < 10){ 
    totalSec = `0${totalSec}`;
  };
  liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; 
  liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); 
});
}


const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
  for(let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    if(allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }
    allLiTags[j].setAttribute("onclick", "clicked(this)");

  }
}

function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
  
