const ApplicationUpdateTemplate = (jobTitle, status) => {
    const statusColor = status === "Hired"
        ? "#16a34a"
        : status === "Rejected"
            ? "#dc2626"
            : "#2563eb";
    const statusMessage = status === "Hired"
        ? `Congratulations! Your application for <strong>${jobTitle}</strong> has been selected. Our recruiter will contact you shortly with the next steps.`
        : status === "Rejected"
            ? `Thank you for applying for the position of <strong>${jobTitle}</strong>. After careful consideration, we have decided to move forward with other candidates. We appreciate your interest and encourage you to apply for future opportunities.`
            : `Your application for <strong>${jobTitle}</strong> has been successfully submitted and is currently under review by our recruitment team.`;
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Application Status Update</title>
<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #f4f7fc;
    font-family: Arial, Helvetica, sans-serif;
  }

  .container {
    max-width: 650px;
    margin: 40px auto;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0px 8px 25px rgba(0,0,0,0.1);
  }

  .header {
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    padding: 35px;
    text-align: center;
    color: white;
  }

  .header h1 {
    margin: 0;
    font-size: 30px;
  }

  .content {
    padding: 40px;
    color: #374151;
    line-height: 1.8;
  }

  .status-box {
    margin: 30px 0;
    background: #f9fafb;
    border-left: 6px solid ${statusColor};
    padding: 20px;
    border-radius: 8px;
  }

  .status {
    color: ${statusColor};
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .job-title {
    color: #111827;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .footer {
    background: #f3f4f6;
    text-align: center;
    padding: 25px;
    color: #6b7280;
    font-size: 14px;
  }

  .button {
    display: inline-block;
    padding: 12px 30px;
    background: #2563eb;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    margin-top: 20px;
    font-weight: bold;
  }
</style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Job Portal</h1>
      <p>Your Application Status Update</p>
    </div>

    <div class="content">
      <h2>Hello Candidate 👋</h2>

      <p>We have an update regarding your job application.</p>

      <div class="status-box">
        <div class="job-title">
          Position: ${jobTitle}
        </div>

        <div class="status">
          Status: ${status}
        </div>

        <p>
          ${statusMessage}
        </p>
      </div>

      ${status === "Hired"
        ? `
      <center>
        <a href="#" class="button">
          View Offer Details
        </a>
      </center>
      `
        : ""}

      <p>
        Thank you for choosing <strong>Job Portal</strong>. We wish you success in your career journey.
      </p>

      <p>
        Best Regards,<br/>
        <strong>Job Portal Recruitment Team</strong>
      </p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Job Portal. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
};
export default ApplicationUpdateTemplate;
