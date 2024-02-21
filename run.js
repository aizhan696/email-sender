// Add event listener for the email form submission
document.getElementById('emailForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission
    
    // Get email details from the form
    const from = document.getElementById('from').value;
    const recipient = document.getElementById('recipient').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
  
    try {
      // Send email data to the server
      const response = await fetch('/send_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, recipient, subject, message }),
      });
  
      // Handle response from the server
      if (response.ok) {
        alert('Email sent successfully!');
      } else {
        const errorMessage = await response.text();
        alert(`Error sending email: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while sending the email.');
    }
  });
