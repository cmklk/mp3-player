
const container=document.querySelector('.container');
const image=document.querySelector('#music-image');
const title=document.querySelector('#music-details .title');
const singer=document.querySelector('#music-details .singer');
const prev=document.querySelector('#controls #prev');
const play=document.querySelector('#controls #play');
const next=document.querySelector('#controls #next');
const duration =document.querySelector('#duration');
const currentTime=document.querySelector('#current-time');
const progresbar=document.querySelector('#progress-bar');
const volume=document.querySelector('#volume');
const volumeBar=document.querySelector('#volume-bar');
const ul=document.querySelector("ul");

const player=new MusicPlayer(musicList);




window.addEventListener("load", ()=>{
    let music = player.getMusic(); // müzik listesi içerisindeki index numarası.
    displayMusic(music);
    displayMusicList(player.musicList); // music listesini görüntüleme sayfa içerisinde
    isPlaying();
})


function displayMusic(music){
    title.innerText=music.getName(); // şarkıcının adını ve şarkı ado
    singer.innerYext=music.singer;  // constructor daki oluşturduğum singer alanı
    image.src="img/"+music.img;
    audio.src="mp3/"+music.file;
}

play.addEventListener("click", ()=>{
    const isMusicPlay=container.classList.contains("playing");
    isMusicPlay ? pauseMusic() : playMusic();
});



function pauseMusic(){
    container.classList.remove("playing");
    play.classList="fa-solid fa-play";
    audio.pause();
}

function playMusic(){
    container.classList.add("playing");
    play.classList="fa-solid fa-pause";
    audio.play();
}



prev.addEventListener("click", ()=>{
   prevMusic();
});


function prevMusic(){
    player.previous();
    let music=player.getMusic();
    displayMusic(music);
    playMusic();
    isPlaying();
}

next.addEventListener("click",()=>{
    nextMusic();
});



function nextMusic(){
    player.next();
    let music=player.getMusic();
    displayMusic(music);
    playMusic();
    isPlaying();
}


const calculateTime=(toplamSaniye)=>{
    const dakika=Math.floor(toplamSaniye/60);
    const saniye=Math.floor(toplamSaniye%60);
    const guncellenenSaniye=saniye<10 ? `0${saniye}`:`${saniye}`;
    const sonuc= `${dakika}:${guncellenenSaniye}`;
    return sonuc;
}

audio.addEventListener("loadedmetadata",()=>{ // audio controle müziğe bağlandığı, ilişkilendirilmesi.
 duration.textContent=calculateTime(audio.duration); //müziğin ses süresini duration text içeriğine eşitledik.
progresbar.value=Math.floor(audio.duration);  // progrebarın değerini oluşturulan şarkının uzubluğuna eşitledik süresine eşitlendi;
});


audio.addEventListener("timeupdate",()=>{  // saniye geçtiği sürece
 progresbar.value=Math.floor(audio.currentTime); // müzik hangi saniyede ise o bilgi bize gelir. 1 2 3 4 şeklinde
 currentTime.textContent=calculateTime(progresbar.value);  // müzik başladığı anda kaçıncı saniye olduğunu fonksiyondaki hesaplamayla sağladık.
});


progresbar.addEventListener("input",()=>{
  currentTime.textContent=calculateTime(progresbar.value); // progresbara tıklandığında hangi saniyede olduğumkuzu öğrenmek için progresbardan değerine göre aldık.
  audio.currentTime=progresbar.value; // şimdiki zaman bilgisini progresbardan aldık.
});


/************SES İŞLEMLERİ************/

let sesDurum="sesli";

volumeBar.addEventListener("input",(e)=>{
     const value=e.target.value;
     audio.volume=value/100;
     if(value==0){
        audio.muted=true;
        sesDurum="sessiz";
        volume.classList="fa-solid fa-volume-xmark";
     }

     else{
        audio.muted=false;
        sesDurum="sesli";
        volume.classList="fa-solid fa-volume-high";
     }
});


volume.addEventListener("click",()=>{
   if(sesDurum==="sesli"){
       audio.muted=true;
       sesDurum="sessiz";
       volume.classList="fa-solid fa-volume-xmark";
       
   }else{
        audio.muted=false;
        sesDurum="sesli";
        volume.classList="fa-solid fa-volume-high";
     
   }
});


const displayMusicList=(list)=>{
    for(let i=0; i<list.length; i++){
        let liTag=
                /*this seçmiş olduğumuz müzik*/    `
                  <li li-index='${i}' onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-content-center">
                    <span>${list[i].getName()}</span>
                    <span id="music-${i}" class="badge bg-primary rounded-pill">3:40</span>
                    <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
                    </li> 
                    `;

                    ul.insertAdjacentHTML("beforeend",liTag);
                        

                    let liAudioDuration=ul.querySelector(`#music-${i}`);
                    let liAudioTag=ul.querySelector(`.music-${i}`);

                    liAudioTag.addEventListener("loadeddata",  () => {
                       liAudioDuration.innerText=calculateTime(liAudioTag.duration);
                    });
                }

}


const selectedMusic=(li)=>{
 player.index= li.getAttribute("li-index"); 
  displayMusic( player.getMusic());
  playMusic();
  isPlaying();
};


const isPlaying=()=>{
   for(let li of ul.querySelectorAll("li")){
    if(li.classList.contains("playing")){
        li.classList.remove("playing");
    }

    if(li.getAttribute("li-index")==player.index){
        li.classList.add("playing");
    }
   }
};


audio.addEventListener("ended",()=>{
    nextMusic();
})