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
    
    const participantsList = activityData.participants.map(participant => 
        `<li>${participant}</li>`
    ).join('');
    
    card.innerHTML = `
        <h3>${activityName}</h3>
        <p><strong>Description:</strong> ${activityData.description}</p>
        <p><strong>Schedule:</strong> ${activityData.schedule}</p>
        <p><strong>Capacity:</strong> ${activityData.participants.length}/${activityData.max_participants}</p>
        
        <div class="participants-section">
            <h4>Current Participants:</h4>
            ${activityData.participants.length > 0 ? 
                `<ul class="participants-list">${participantsList}</ul>` : 
                '<p class="no-participants">No participants yet</p>'
            }
        </div>
        
        <div class="signup-section">
            <input type="email" placeholder="Enter your email" class="email-input">
            <button onclick="signUpForActivity('${activityName}', this)" class="signup-btn">Sign Up</button>
        </div>
    `;
    
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
