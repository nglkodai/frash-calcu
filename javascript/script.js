document.getElementById('TopLink').onclick = function(){
  setParameter();
}
var parameters='';
function setParameter(){
  var url = window.location.href;
  var re_url = url.replace(/\?.*$/,"");
  window.location.href = re_url + parameters;
};

window.onload = function(){
  console.log('window-onload');
  getParameter()
  .then(Difine)
  .catch(onRejected2)
};

/***** URL取得 *****/
function getParameter(){
  return new Promise((resolve,reject) => {
    var url = location.search;
    resolve(url); /* -> Difine() */
  })
};

function Difine(parameter){
  return new Promise((resolve,reject) => {
    console.log('parameter = ' + parameter);
    /***** difficulty *****/
    var element_difficulty = document.getElementById('js-difficulty');
    var Diff = element_difficulty.difficulty;
      if(parameter=='?1'){
        Diff[0].checked = true;  /* EASY Check */
      }else if(parameter=='?2'){
        Diff[1].checked = true;  /* NORMAL Check */
      }else if(parameter=='?3'){
        Diff[2].checked = true;  /* HARD Check */
      }else{
        Diff[1].checked = true;  /***** default EASY *****/
      }
    resolve();
  })
};

function onRejected2(error) {
  console.log("error2 = " + error);
}

function StartNav() {
  return new Promise((resolve,reject) => {
    var body = document.body;
    body.addEventListener('keypress',onKeyPress);
    function onKeyPress(e){
      if(e.keyCode == '13'){
        /***** difficulty *****/
        var element_difficulty = document.getElementById('js-difficulty');
        var difficultyList = element_difficulty.difficulty;
        var diff = difficultyList.value;
        resolve(diff); /* -> SetCss() */
      }
    }
  })
}

/***** 難易度定義 *****/
var COUNT=60;
function SetCss(diff){
  return new Promise((resolve,reject) => {
    console.log('難易度' + diff); /* debug */
    var body = document.body;
    var time; /* 数字の表示時間 [ms] */
    /* 乱数範囲 (min - max) */
    var min;
    var max;
    if(diff=='1'){  /* EASY */
      body.classList.toggle('World-EASY');
      document.documentElement.style.setProperty('--base-time','1s');
      time = 500;
      min = 1;
      max = 10;
    }
    else if(diff=='2'){ /* NORMAL */
      body.classList.toggle('World-NORMAL');
      document.documentElement.style.setProperty('--base-time','1s');
      time = 500;
      min = 7;
      max = 29;
      COUNT = 30
    }
    else if(diff=='3'){ /* HARD */
      body.classList.toggle('World-HARD');
      document.documentElement.style.setProperty('--base-time','1s');
      time = 500;
      min = 50;
      max = 99;
    }
    var Time = time*2;
    parameters = '?' + diff; /* URL用パラメータ設定 */
    resolve([time,Time,min,max]); /* -> CountDown() */
  })
}

/***** カウントダウン処理 *****/
function CountDown(array){
  return new Promise((resolve,reject) => {
    var body = document.body;
    body.addEventListener('keypress',onkeypress)
    body.classList.toggle('calcu-open');
    body.classList.toggle('mario-open');
    var count = 3;
    var key = 0;
    document.getElementById('BGM').play();
    var id = setInterval(function(){
      if(count==key){
        body.classList.toggle('countdown-close');
        clearInterval(id);
        resolve(array); /* -> Question() */
      }else{
        count--;
      }
    },1000)
  })
}

function Question(array){
  return new Promise((resolve,reject) => {
    var count = 0;
    var N = 5;       /* 問題数 */
    var ModelSum = {value: 0};
    /***** interval *****/
    var time=array[0];
    var Time=array[1];
    /***** digit *****/
    var min=array[2];
    var max=array[3];
    document.getElementById('loop').innerHTML = count + "/" + N;
    Loop(count,min,max,N,ModelSum,time,Time);
    setTimeout(function(){
      resolve(ModelSum,); /* -> ApperanceButton() */
    },N*Time-time)
  })
}

function Loop(count,min,max,N,ModelSum,time,Time){
  count++;
  /*console.log(count);*/
  ModelSum.value += Random(min,max,time);
  document.getElementById('loop').innerHTML = count + "/" + N;
  var id = setTimeout(Loop.bind(this,count,min,max,N,ModelSum,time,Time),Time,);
  if(count >= N){
    clearTimeout(id);
  }
}

/***** 乱数 *****/
function Random(min,max,time){
  var random = Math.floor(Math.random() * (max+1-min))+min;
  document.getElementById('output').innerHTML = random;
  document.getElementById('CoinSound').play();
  setTimeout(function(){
    document.getElementById('output').innerHTML = "";
  },time)
  return random;
}


function AppearanceButton(ModelSum){
  return new Promise((resolve,reject) => {
    var body = document.body;
    document.getElementById('loop').innerHTML = "";
    body.classList.toggle('AppButton');
    document.getElementById('textBox').focus();
    var count = COUNT;
    var key = 0;
    document.getElementById('BGM').play();
    var id = setInterval(function(){
      if(count==key){
        document.getElementById('loop').innerHTML = count + "秒";
        document.getElementById('Countdown').play();
        clearInterval(id);
        
        document.getElementById('BGM').pause();
        document.getElementById('EndingSound').play();
        ShowAns(ModelSum);
        body.classList.toggle('open-end');
      }else{
        document.getElementById('Timer').innerHTML = "あと" + count + "秒";
        count--;
      }
    },1000)
    resolve(ModelSum); /* -> Output() */
  })
}

function Output(ModelSum){
  return new Promise((resolve,reject) => {
    console.log('Output');
    Enter(ModelSum);
    resolve(ModelSum);
  })
}

function Enter(ModelSum){
  /***** Enter-Key *****/
  var bodyContents = document.getElementById('textBox');
  var body = document.body;
  bodyContents.addEventListener('keypress',onKeyPress);
  function onKeyPress(e){
    if(e.keyCode == '13'){
      document.getElementById('Countdown').pause();
      document.getElementById('BGM').pause();
      document.getElementById('EndingSound').play();
      ShowAns(ModelSum);
      body.classList.toggle('open-end');
    }
  }
}

/***** 解答表示 *****/
function ShowAns(ModelSum){
  console.log('ShowAns');
  document.getElementById('OUTPUT').innerHTML = ModelSum.value;
  /***** debug *****/
  console.log("Answer = " +ModelSum.value);
  
  var body = document.body;
  var message = document.getElementById('textBox').value;
  if(message == ModelSum.value){
    body.classList.toggle('open-ok');
    document.getElementById('CorrectSound').play();
    console.log('○'); /* debug */
  }else{
    body.classList.toggle('open-bad');
    document.getElementById('IncorrectSound').play();
    console.log('×'); /* debug */
  }
}


function onRejected1(error) {
  console.log("error1 = " + error);
}

StartNav()
.then(SetCss)
.then(CountDown)
.then(Question)
.then(AppearanceButton)
.then(Output)
.catch(onRejected1)
