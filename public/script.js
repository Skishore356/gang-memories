const members = [
 {name:"Kishore", nick:"Heisenberg", img:"members/kishore.jpg"},
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

function loadMembers(){
  const grid=document.getElementById("memberGrid");
  grid.innerHTML="";

  members.forEach(m=>{
    grid.innerHTML += `
      <div class="member" onclick="searchMemories('${m.name}')">
        <img src="${m.img}" onerror="this.src='members/default.jpg'">
        <h4>${m.name}</h4>
        <p>${m.nick}</p>
      </div>`;
  });
}
function display(data){
  const gallery=document.getElementById("gallery");
  gallery.innerHTML="";

  data.slice().reverse().forEach(m=>{
    const media = m.file.endsWith(".mp4")
      ? `<video controls src="${m.file}"></video>`
      : `<img src="${m.file}">`;

    const comments=(m.comments||[]).map(c =>
      `<p><b>${c.name}</b>: ${c.text}</p>`
    ).join("");

    gallery.innerHTML+=`
      <div class="card">
        ${media}

        <div class="meta">
          <span class="eventTag">${m.event}</span>
          <p class="author">By ${m.author}</p>
        </div>

        <p class="desc">${m.description}</p>

        <button onclick="likeMemory(${m.id})">
          ❤️ ${m.likes||0}
        </button>

        <div class="comments">
          ${comments}
          <input placeholder="Name" id="name-${m.id}">
          <input placeholder="Add a memory..." id="comment-${m.id}">
          <button onclick="addComment(${m.id})">Post</button>
        </div>
      </div>
    `;
  });
}

async function likeMemory(id){
  await fetch(`/like/${id}`, { method:"POST" });
  loadMemories();
}

async function addComment(id){
  const name = document.getElementById(`name-${id}`).value;
  const text = document.getElementById(`comment-${id}`).value;

  await fetch(`/comment/${id}`, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ name, text })
  });

  loadMemories();
}

function searchMemories(query){
  const gallery=document.getElementById("gallery");

  if(!query){
    display(memories);
    return;
  }

  const q=query.toLowerCase();

  const results=memories.filter(m =>
    (m.author && m.author.toLowerCase().includes(q)) ||
    (m.event && m.event.toLowerCase().includes(q)) ||
    (m.description && m.description.toLowerCase().includes(q))
  );

  if(results.length===0){
    gallery.innerHTML="<h2>No memories found 😔</h2>";
    return;
  }

  display(results);

  // Scroll to results
  gallery.scrollIntoView({behavior:"smooth"});
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