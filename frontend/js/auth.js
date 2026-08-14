// ==============================
// REGISTER
// ==============================

const registerForm = document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        const message =
            document.getElementById("registerMessage");


        // Check passwords
        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            return;
        }


        try {

            const data = await apiRequest(
                "/auth/register",
                {
                    method: "POST",

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );


            message.textContent =
                data.message;


            // Go to login page
            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1000);


        } catch (error) {

            message.textContent =
                error.message;

        }

    });

}



// ==============================
// LOGIN
// ==============================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        const message =
            document.getElementById("loginMessage");


        try {

            const data = await apiRequest(
                "/auth/login",
                {
                    method: "POST",

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            // Save JWT token
            localStorage.setItem(
                "token",
                data.token
            );


            // Save user
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            message.textContent =
                "Login successful!";


            // Open dashboard
            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 500);


        } catch (error) {

            message.textContent =
                error.message;

        }

    });

}