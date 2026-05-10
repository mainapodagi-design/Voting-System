const hasVoted = localStorage.getItem("hasVoted");

if(hasVoted){
  document.getElementById("votePage").style.display="none";
  document.getElementById("resultPage").style.display="block";
  showResults();
}

function clearChoice(position){
  document.querySelectorAll(`input[name="${position}"]`).forEach(r=>r.checked=false);
}

function submitVote(){
  if(localStorage.getItem("hasVoted")) return;

  const positions=["President","Vice President","Secretary"];
  let voteData={};

  for(let pos of positions){
    let selected=document.querySelector(`input[name="${pos}"]:checked`);
    if(!selected){
      alert("Please complete all positions before submitting.");
      return;
    }
    voteData[pos]=selected.value;
  }

  localStorage.setItem("voteData",JSON.stringify(voteData));
  localStorage.setItem("hasVoted",true);

  document.getElementById("votePage").style.display="none";
  document.getElementById("resultPage").style.display="block";

  showResults();
}

function showResults(){
  const data=JSON.parse(localStorage.getItem("voteData"));
  const resultsDiv=document.getElementById("results");
  resultsDiv.innerHTML="";

  for(let key in data){
    let box=document.createElement("div");
    box.className="result-box";
    box.innerHTML=`<strong>${key}</strong><br>Selected: ${data[key]}<div class="bar"><div class="bar-fill"></div></div>`;
    resultsDiv.appendChild(box);
  }
}