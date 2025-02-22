const core = require("@actions/core"); // GitHub Actions toolkit for handling inputs and outputs
const exec = require("@actions/exec"); // Allows execution of shell commands

// Main function to execute deployment
async function run() {
  try {
    // 🔧 Get required inputs from the GitHub Actions workflow
    const bucket = core.getInput("bucketName", { required: true }); // S3 bucket name
    const bucketRegion = core.getInput("bucketRegion", { required: true }); // AWS region for the bucket
    const distFiles = core.getInput("distFiles", { required: true }); // Path to the build artifacts

    // 📂 Construct the S3 URL
    const s3Url = `s3://${bucket}`;

    // 🚀 Execute AWS CLI command to sync local files to the S3 bucket
    // The --region flag specifies the AWS region for the operation
    await exec.exec(
      `aws s3 sync ${distFiles} ${s3Url} --region ${bucketRegion}`
    );

    // 🌐 Construct the website URL based on the S3 bucket details
    const websiteURL = `http://${bucket}.s3-website-${bucketRegion}.amazonaws.com`;

    // 📝 Set the output variable "URL" to make it available to subsequent steps in the workflow
    core.setOutput("URL", websiteURL);
    core.info(`✅ Deployment complete: ${websiteURL}`); // Log the deployment URL
  } catch (error) {
    // ⚠️ Handle any errors that occur during the deployment process
    core.setFailed(`❌ Deployment failed: ${error.message}`);
  }
}

// 🚀 Execute the main function
run();