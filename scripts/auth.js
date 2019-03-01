// add admin cloud functions
const adminForm = document.querySelector(".admin-actions")
adminForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const adminEmail = document.querySelector("#admin-email").value
  const addAdminRole = functions.httpsCallable("addAdminRole")
  addAdminRole({email: adminEmail}).then(result => {
    console.log(result)
  })
})


// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    // check jika user adalah admin
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin
      setupUINavbar(user);
    })

    // getting data guides
    db.collection("guides")
      .onSnapshot(snapshot => { // firestore real-time listener
        setupGuides(snapshot.docs)
      }, function(err) { // handle error ketika user logout 
        console.log(err.message)
      })
  } else {
    setupUINavbar()
    setupGuides([])
  }
})


// buat guide baru
const createForm = document.querySelector("#create-form")
createForm.addEventListener("submit", (e) => {
  e.preventDefault()
  
  // tambah guide
  db.collection("guides").add({
    title: createForm["title"].value,
    content: createForm["content"].value
  }).then(() => {
    // close modal and reset form
    const modal = document.querySelector("#modal-create")
    M.Modal.getInstance(modal).close()
    createForm.reset()
  }).catch(err => {
    console.log(err.message)
  })

})


// Signup
const signupForm = document.querySelector("#signup-form")
signupForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // get user info
  const email = signupForm["signup-email"].value
  const password = signupForm["signup-password"].value
  
  // sign up the user
  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => { // credentials
      // create document dan buat user uid manual, 
      // kemudian buat struktur collection datanya
      return db.collection("users").doc(cred.user.uid).set({
        bio: signupForm["signup-bio"].value
      })
    })
    .then(() => {
      // close modal and reset form
      const modal = document.querySelector("#modal-signup")
      M.Modal.getInstance(modal).close()
      signupForm.reset()
      signupForm.querySelector(".error").innerHTML = ""
    })
    .catch(err => {
      signupForm.querySelector(".error").innerHTML = err.message
    })
})


// logout method
const logout = document.querySelector("#logout")
logout.addEventListener("click", (e) => {
  e.preventDefault()
  auth.signOut()
})


// login
const loginForm = document.querySelector("#login-form")
loginForm.addEventListener("submit", (e) => {
  e.preventDefault()
  
  // get user info
  const email = loginForm["login-email"].value
  const password = loginForm["login-password"].value
  
  // sign in the user
  auth.signInWithEmailAndPassword(email, password)
    .then(cred => {
      // close modal and reset form
      const modal = document.querySelector("#modal-login")
      M.Modal.getInstance(modal).close()
      loginForm.reset()
      loginForm.querySelector(".error").innerHTML = ""
    })
    .catch(err => {
      loginForm.querySelector(".error").innerHTML = err.message
    })
})