document.getElementById('TopLink').onclick = function(){
  setParameter();
}

function setParameter(){
  /***** interval *****/
  var element_interval = document.getElementById('js-interval');
  var intervalList = element_interval.interval;
  var time = intervalList.value;
  /***** digit *****/
  var element_digit = document.getElementById('js-digit');
  var digitList = element_digit.digit;
  var digit = digitList.value;  
  
  var parameters = '?' + time + '&' + digit;
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

function getParameter(){
  return new Promise((resolve,reject) => {
    var url = location.search;
    var parameter_array=[];
    var parameter = url.split('&');
    if(parameter.length==1){
      parameter_array[0]=0;
      parameter_array[1]=0;
    }else{
      parameter_array[0]=parameter[0];
      parameter_array[1]=parameter[1];
    }
    resolve(parameter_array);
  })
};

function Difine(parameter){
  return new Promise((resolve,reject) => {
    console.log('interval = ' + parameter[0]);
    console.log('digit = ' + parameter[1]);
    /***** interval *****/
    var element_Interval = document.getElementById('js-interval');
      var Interval = element_Interval.interval;
      if(parameter[0]=='?0.5'){
        Interval[0].checked = true;
      }else if(parameter[0]=='?1'){
        Interval[1].checked = true;
      }else if(parameter[0]=='?2'){
        Interval[2].checked = true;
      }else{
        Interval[0].checked = true;  /***** default *****/
      }
    /***** digit *****/
    var element_Digit = document.getElementById('js-digit');
      var Digit = element_Digit.digit;
      if(parameter[1]=='1'){
        Digit[0].checked = true;
      }else if(parameter[1]=='2'){
        Digit[1].checked = true;
      }else if(parameter[1]=='3'){
        Digit[2].checked = true;
      }else{
        Digit[1].checked = true; /***** default *****/
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
        /***** interval *****/
        var element_interval = document.getElementById('js-interval');
        var intervalList = element_interval.interval;
        var time = intervalList.value;
        /***** digit *****/
        var element_digit = document.getElementById('js-digit');
        var digitList = element_digit.digit;
        var digit = digitList.value;
        resolve([time,digit]);
      }
    }
  })
}

/***** css用変数定義 *****/
function SetCss(array){
  return new Promise((resolve,reject) => {
    if(array[0]==0.5){
      document.documentElement.style.setProperty('--base-time','1s');
    }else if(array[0]==1){
      document.documentElement.style.setProperty('--base-time','2s');
    }else{
      document.documentElement.style.setProperty('--base-time','4s');
    }
    resolve(array);
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
    var id = setInterval(function(){
      if(count==key){
        body.classList.toggle('countdown-close');
        clearInterval(id);
        resolve(array);
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
    value=difficulty(array);
    /***** time *****/
    var time=value[0];
    var Time=value[1];
    /***** digit *****/
    var min=value[2];
    var max=value[3];
    document.getElementById('loop').innerHTML = count + "/" + N;
    Loop(count,min,max,N,ModelSum,time,Time);
    setTimeout(function(){
      resolve([ModelSum,array[0]]);
    },N*Time-time)
  })
}

/***** 難易度調整 *****/
function difficulty(array){
  /***** interval *****/
  if(array[0]==""){
    var time = 500;    /*default time*/
  }else{
    var time = array[0]*1000;
  }
  var Time = time*2;
  
  /***** digit *****/
  if(array[1]==""){
    var min=1;      /*default digit*/
    var max=10;
  }else if(array[1]==1){ /* easy */
    var min=1;
    var max=10;
  }else if(array[1]==2){ /* normal */
    var min=7;
    var max=29;
  }else if(array[1]==3){ /* hard */
    var min=81;
    var max=120;
  }
  return [time,Time,min,max];
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
  setTimeout(function(){
    document.getElementById('output').innerHTML = "";
  },time)
  return random;
}

function AppearanceButton(Array){
  return new Promise((resolve,reject) => {
    var body = document.body;
    //setTimeout(function(){
      body.classList.toggle('AppButton');
      resolve(Array[0]);
    //},Array[1]*1000)
  })
}

function Output(ModelSum){
  return new Promise((resolve,reject) => {
    var key = 0;
    Enter(ModelSum);
    resolve(ModelSum);
  })
}

function Enter(ModelSum){
  /***** Answer-Button *****/
  var btn = document.getElementById('AnsButton');
  btn.addEventListener('click' , function(){
    ShowAns(ModelSum);
  },false);
  
  /***** Enter-Key *****/
  var bodyContents = document.getElementById('textBox');
  bodyContents.addEventListener('keypress',onKeyPress);
  function onKeyPress(e){
    if(e.keyCode == '13'){
      ShowAns(ModelSum);
    }
  }
}

/***** 解答表示 *****/
function ShowAns(ModelSum){
  document.getElementById('output').innerHTML = ModelSum.value;
  
  /***** debug *****/
  console.log("Answer = " +ModelSum.value);
  
  var message = document.getElementById('textBox').value;
  if(message == ModelSum.value){
    document.getElementById('checkBox').innerHTML = "正解";
  }else{
    document.getElementById('checkBox').innerHTML = "不正解";
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
