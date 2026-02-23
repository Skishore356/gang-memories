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

async function loadMemories() {
  const res = await fetch("/memories");
  memories = await res.json();
  display(memories);
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