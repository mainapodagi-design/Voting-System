// CHART

const ctx = document.getElementById('chart');
new Chart(ctx, {
  type:'doughnut',
  data:{
    labels:[
      'Michael Johnson',
      'Sarah Williams',
      'Daniel Brown'
    ],

    datasets:[{
      data:[5400,4920,3978],
      backgroundColor:[
        '#3b82f6',
        '#8b5cf6',
        '#06b6d4'
      ]

    }]
  },
  options:{
    responsive:true,
    plugins:{
      legend:{
        labels:{
          color:'white'
        }
      }
    }
  }

});

// REALTIME ACTIVITY LOG SIMULATION

const logsContainer = document.getElementById('logsContainer');

const activities = [

  'User #301 voted for Michael Johnson',
  'Vote successfully submitted',
  'Admin updated election analytics',
  'New voter logged into system',
  'Election database synchronized',
  'Candidate profile updated',
  'Real-time results refreshed'

];

function addLog(){

  const log = document.createElement('div');

  log.classList.add('log-item');

  const time = new Date().toLocaleTimeString();

  const randomActivity =
  activities[Math.floor(Math.random()*activities.length)];

  log.innerHTML = `
    <span class="time">${time}</span>
    <p>${randomActivity}</p>
  `;

  logsContainer.prepend(log);

}

setInterval(addLog,4000);

