const members = [
 {name:"Kishore", nick:"Boss", img:"members/kishore.jpg"},
 {name:"Jayavenket", nick:"...", img:"members/jayavenket.jpg"},
 {name:"Logeshwaran", nick:"Vedi", img:"members/logesh.jpg"},
 {name:"Sanjay", nick:"Apur", img:"members/sanjay.jpg"},
 {name:"Sanjaikumar", nick:"Kumar", img:"members/sanjaikumar.jpg"},
 {name:"Vishnu", nick:"15 Parottas", img:"members/vishnu.jpg"},
 {name:"Sivabharathi", nick:"Baladhi", img:"members/sivabharathi.jpg"},
 {name:"Rohith R", nick:"Kuttipaiyan", img:"members/rohithr.jpg"},
 {name:"Rohith V", nick:"BRO!", img:"members/rohithv.jpg"},
 {name:"Mohith", nick:"...", img:"members/mohith.jpg"},
 {name:"Muthu", nick:"Cutie", img:"members/muthu.jpg"},
 {name:"Sivaprasath", nick:"Chottu", img:"members/sivaprasath.jpg"}
];

let memories = [];

async function login() {
  const password = document.getElementById("password").value;

  const res = await fetch("/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });

  if (res.status === 200) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("main").style.display = "block";
    loadMemories();
  } else {
    alert("Wrong Password!");
  }
}

function loadMembers(){
  const grid=document.getElementById("memberGrid");
  members.forEach(m=>{
    grid.innerHTML += `
      <div class="member">
        <img src="${m.img}">
        <h4>${m.name}</h4>
        <p>${m.nick}</p>
      </div>`;
  });
}

async function loadMemories() {
  const res = await fetch("/memories");
  memories = await res.json();

  display(memories);
  loadMembers();
  buildEventMenu();
}

function display(data) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  data.slice().reverse().forEach(m => {
    const card = document.createElement("div");
    card.className = "card";

    const media = m.file.endsWith(".mp4")
      ? `<video controls src="${m.file}"></video>`
      : `<img src="${m.file}">`;

    card.innerHTML = `
      ${media}
      <p><b>${m.author}</b></p>
      <p>${m.event}</p>
      <p>${m.description}</p>
    `;

    gallery.appendChild(card);
  });
}

function searchMemories(query) {
  const q = query.toLowerCase();

  const filtered = memories.filter(m =>
    m.author.toLowerCase().includes(q) ||
    m.event.toLowerCase().includes(q) ||
    m.description.toLowerCase().includes(q)
  );

  display(filtered);
}

async function upload() {
  const formData = new FormData();

  formData.append("file", document.getElementById("file").files[0]);
  formData.append("author", document.getElementById("author").value);
  formData.append("event", document.getElementById("event").value);
  formData.append("description", document.getElementById("description").value);

  await fetch("/upload", { method: "POST", body: formData });

  alert("Memory Uploaded ❤️");
  loadMemories();
}

function buildEventMenu(){
  const events=[...new Set(memories.map(m=>m.event))];
  const menu=document.getElementById("eventMenu");
  menu.innerHTML='<div onclick="display(memories)">All</div>';

  events.forEach(e=>{
    menu.innerHTML+=`<div onclick="filterEvent('${e}')">${e}</div>`;
  });
}

function filterEvent(event){
  display(memories.filter(m=>m.event===event));
}