const core = require('@actions/core'); // get inputs and set outputs
const exec = require('@actions/exec'); // interact with the CLI

async function run() {
  try {
    // Get inputs
    const bucket = core.getInput('bucketName', { required: true });
    const bucketRegion = core.getInput('bucketRegion', { required: true });
    const distFiles = core.getInput('distFiles', { required: true });

    // Upload
    const s3Url = `s3://${bucket}`;
    await exec.exec(`aws s3 sync ${distFiles} ${s3Url} --region ${bucketRegion}`);

    const websiteURL = `http://${bucket}.s3-website-${bucketRegion}.amazonaws.com`;
    core.setOutput("URL", websiteURL); // Set the output URL
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();