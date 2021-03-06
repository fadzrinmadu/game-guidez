const guides = document.querySelector(".guides")
const loggedOutLinks = document.querySelectorAll(".logged-out")
const loggedInLinks = document.querySelectorAll(".logged-in")
const accoundDetails = document.querySelector(".account-details")
const adminItems = document.querySelectorAll(".admin")

// setup ui navbar
const setupUINavbar = (user) => {
  if (user) {
    // cek jika user adalah admin, maka tampilkan admin item
    if (user.admin) {
      adminItems.forEach(item => item.style.display = "block")
    }

    // akun info
    db.collection("users").doc(user.uid).get().then(doc => {
      const html = `
        <div>Logged in as ${user.email}</div>
        <div>${doc.data().bio}</div>
        <div class="pink-text">${user.admin ? 'Admin': ''}</div>
      `
      accoundDetails.innerHTML = html
    })

    // toggle ui element
    loggedInLinks.forEach(item => item.style.display = "block")
    loggedOutLinks.forEach(item => item.style.display = "none")
  } else {
    // hapus admin item
    adminItems.forEach(item => item.style.display = "none")

    // hide account info
    accoundDetails.innerHTML = ""

    // toggle ui element
    loggedInLinks.forEach(item => item.style.display = "none")
    loggedOutLinks.forEach(item => item.style.display = "block")
  }
}

// setup guides
const setupGuides = (data) => {
  if (data.length) {
    let html = ""
    data.forEach(doc => {
      const guide = doc.data()
      const li = `
        <li>
          <div class="collapsible-header grey lighten-4">${guide.title}</div>
          <div class="collapsible-body white">${guide.content}</div>
        </li>
      `
      html += li
    })
    guides.innerHTML = html
  } else {
    guides.innerHTML = `<h5 class="center-align">Login to view guides</h5>`
  }
}

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});