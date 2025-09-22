document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = createActivityCard(name, details);

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  function createActivityCard(activityName, activityData) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    
    // Create card header and details
    const header = document.createElement('h3');
    header.textContent = activityName;
    card.appendChild(header);

    const desc = document.createElement('p');
    desc.innerHTML = `<strong>Description:</strong> ${activityData.description}`;
    card.appendChild(desc);

    const schedule = document.createElement('p');
    schedule.innerHTML = `<strong>Schedule:</strong> ${activityData.schedule}`;
    card.appendChild(schedule);

    const capacity = document.createElement('p');
    capacity.innerHTML = `<strong>Capacity:</strong> ${activityData.participants.length}/${activityData.max_participants}`;
    card.appendChild(capacity);

    // Participants section
    const participantsSection = document.createElement('div');
    participantsSection.className = 'participants-section';

    const participantsHeader = document.createElement('h4');
    participantsHeader.textContent = 'Current Participants:';
    participantsSection.appendChild(participantsHeader);

    if (activityData.participants.length > 0) {
      const ul = document.createElement('ul');
      ul.className = 'participants-list';
      activityData.participants.forEach(participant => {
        const li = document.createElement('li');
        li.textContent = participant;
        ul.appendChild(li);
      });
      participantsSection.appendChild(ul);
    } else {
      const noParticipants = document.createElement('p');
      noParticipants.className = 'no-participants';
      noParticipants.textContent = 'No participants yet';
      participantsSection.appendChild(noParticipants);
    }
    card.appendChild(participantsSection);

    // Signup section
    const signupSection = document.createElement('div');
    signupSection.className = 'signup-section';

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.placeholder = 'Enter your email';
    emailInput.className = 'email-input';
    signupSection.appendChild(emailInput);

    const signupBtn = document.createElement('button');
    signupBtn.className = 'signup-btn';
    signupBtn.textContent = 'Sign Up';
    signupBtn.onclick = function() {
      signUpForActivity(activityName, this);
    };
    signupSection.appendChild(signupBtn);

    card.appendChild(signupSection);
    // Attach event listener to the signup button
    const signupBtn = card.querySelector('.signup-btn');
    signupBtn.addEventListener('click', function() {
        // Assuming signUpForActivity is defined globally
        signUpForActivity(activityName, signupBtn);
    });
    return card;
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
